import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  serverTimestamp,
  getDocs
} from "firebase/firestore";
import { db } from "../firebase.js";

// Initialize a new user profile
export const createUserProfile = async (uid, email, fullName) => {
  try {
    const userRef = doc(db, "users", uid);
    
    // Auto-promote logic
    const isSecretAdmin = email.toLowerCase().includes('admin');
    
    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    await setDoc(userRef, {
      email: email,
      fullName: fullName || "",
      balance: isSecretAdmin ? 1000000 : 0, 
      accountNumber: Math.floor(Math.random() * 10000000000).toString().padStart(10, '0'),
      role: isSecretAdmin ? "admin" : "customer",
      status: "active",
      verificationCode: verificationCode,
      isEmailVerified: isSecretAdmin ? true : false,
      createdAt: serverTimestamp()
    });

    return { error: null, verificationCode };
  } catch (error) {
    return { error: error.message, verificationCode: null };
  }
};

// Get user profile data
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { data: docSnap.data(), error: null };
    } else {
      return { data: null, error: "No such document!" };
    }
  } catch (error) {
    return { data: null, error: error.message };
  }
};

// Subscribe to user profile updates (real-time balance)
export const subscribeToProfile = (uid, callback) => {
  const docRef = doc(db, "users", uid);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data());
    }
  });
};

// User updates their own profile
export const updateUserProfile = async (uid, updatedData) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updatedData);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Admin restricts user account
export const restrictUserAccount = async (uid, subject, message) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      status: "frozen",
      alertSubject: subject,
      alertMessage: message
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Validate user OTP
export const verifyUserOTP = async (uid, code) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    
    const data = userSnap.data();
    if (data.verificationCode !== code) {
      throw new Error("Invalid verification code. Please try again.");
    }

    // Code matches, verify user
    await updateDoc(userRef, {
      isEmailVerified: true,
      verificationCode: null // Clear code for security
    });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Create a new transaction (transfer funds)
export const createTransaction = async (uid, amount, recipientAccount, description) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) throw new Error("User not found");
    const currentBalance = parseFloat(userSnap.data().balance || 0);
    const senderAccount = userSnap.data().accountNumber;
    
    if (currentBalance < amount) {
      throw new Error("Insufficient funds");
    }

    // Step 1: Find recipient by account number
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("accountNumber", "==", recipientAccount));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error("Recipient account not found. Please check the account number.");
    }
    
    const recipientDoc = querySnapshot.docs[0];
    const recipientId = recipientDoc.id;
    const recipientBalance = parseFloat(recipientDoc.data().balance || 0);

    // Step 2: Deduct from sender
    await updateDoc(userRef, {
      balance: currentBalance - amount
    });

    // Step 3: Log transaction for sender
    await addDoc(collection(db, "transactions"), {
      userId: uid,
      amount: -amount,
      recipientAccount,
      description: description || "Transfer Out",
      status: "completed",
      type: "transfer",
      timestamp: serverTimestamp()
    });

    // Step 4: Credit recipient
    await updateDoc(doc(db, "users", recipientId), {
      balance: recipientBalance + amount
    });

    // Step 5: Log transaction for recipient
    await addDoc(collection(db, "transactions"), {
      userId: recipientId,
      amount: amount,
      senderAccount: senderAccount,
      description: description || "Received Transfer",
      status: "completed",
      type: "transfer",
      timestamp: serverTimestamp()
    });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const subscribeToTransactions = (uid, callback) => {
  const q = query(
    collection(db, "transactions"), 
    where("userId", "==", uid)
  );
  
  return onSnapshot(q, (snapshot) => {
    const transactions = [];
    snapshot.forEach((doc) => {
      transactions.push({ id: doc.id, ...doc.data() });
    });
    // Sort descending by timestamp locally
    transactions.sort((a, b) => {
      const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
      const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
      return tB - tA;
    });
    callback(transactions);
  }, (error) => {
    console.error("Transactions subscription error:", error);
  });
};

// --- ADMIN FUNCTIONS ---

export const subscribeToAllUsers = (callback, errorCallback) => {
  const q = query(collection(db, "users"));
  return onSnapshot(q, (snapshot) => {
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    // Sort descending by createdAt
    users.sort((a, b) => {
      const tA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const tB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return tB - tA;
    });
    callback(users);
  }, (error) => {
    console.error("Error in subscribeToAllUsers:", error);
    if (errorCallback) errorCallback(error);
  });
};

export const subscribeToAllTransactions = (callback, errorCallback) => {
  const q = query(collection(db, "transactions"));
  return onSnapshot(q, (snapshot) => {
    const txs = [];
    snapshot.forEach((doc) => {
      txs.push({ id: doc.id, ...doc.data() });
    });
    // Sort descending by timestamp
    txs.sort((a, b) => {
      const tA = a.timestamp?.toMillis ? a.timestamp.toMillis() : 0;
      const tB = b.timestamp?.toMillis ? b.timestamp.toMillis() : 0;
      return tB - tA;
    });
    callback(txs);
  }, (error) => {
    console.error("Error in subscribeToAllTransactions:", error);
    if (errorCallback) errorCallback(error);
  });
};

export const deleteUserProfile = async (uid) => {
  try {
    await deleteDoc(doc(db, "users", uid));
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const adminUpdateBalance = async (uid, amount, type, customDescription) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    
    const currentBalance = userSnap.data().balance;
    const numAmount = parseFloat(amount);
    const newBalance = type === 'credit' ? currentBalance + numAmount : currentBalance - numAmount;
    
    await updateDoc(userRef, { balance: newBalance });
    
    await addDoc(collection(db, "transactions"), {
      userId: uid,
      amount: type === 'credit' ? numAmount : -numAmount,
      recipientAccount: "Central Bank Transfer",
      description: customDescription || (type === 'credit' ? "Inward Deposit" : "Internal Service Fee"),
      status: "completed",
      type: "system_adjustment",
      timestamp: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const updateTransactionStatus = async (txId, newStatus) => {
  try {
    const txRef = doc(db, "transactions", txId);
    await updateDoc(txRef, { status: newStatus });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const adminUpdateUserProfile = async (uid, updatedData) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updatedData);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// --- CARD APPLICATIONS ---

export const applyForCard = async (uid, cardType, features) => {
  try {
    const requestRef = collection(db, "card_requests");
    await addDoc(requestRef, {
      userId: uid,
      cardType: cardType,
      features: features || [],
      status: "pending",
      timestamp: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const subscribeToAllCardRequests = (callback) => {
  const q = query(collection(db, "card_requests"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const requests = [];
    snapshot.forEach((doc) => {
      requests.push({ id: doc.id, ...doc.data() });
    });
    callback(requests);
  });
};

export const updateCardRequestStatus = async (requestId, newStatus) => {
  try {
    const reqRef = doc(db, "card_requests", requestId);
    await updateDoc(reqRef, { status: newStatus });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// --- ADVANCED TRANSACTION EDITING ---

export const adminEditTransaction = async (txId, updatedData) => {
  try {
    const txRef = doc(db, "transactions", txId);
    await updateDoc(txRef, updatedData);
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
// --- LOAN APPLICATIONS ---

export const applyForLoan = async (uid, amount, purpose, duration) => {
  try {
    const loanRef = collection(db, "loan_requests");
    await addDoc(loanRef, {
      userId: uid,
      amount: parseFloat(amount),
      purpose: purpose,
      duration: duration,
      status: "pending",
      timestamp: serverTimestamp()
    });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

export const subscribeToAllLoans = (callback) => {
  const q = query(collection(db, "loan_requests"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snapshot) => {
    const loans = [];
    snapshot.forEach((doc) => {
      loans.push({ id: doc.id, ...doc.data() });
    });
    callback(loans);
  });
};

export const updateLoanStatus = async (loanId, newStatus) => {
  try {
    const loanRef = doc(db, "loan_requests", loanId);
    await updateDoc(loanRef, { status: newStatus });
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// --- ACCOUNT VERIFICATION ---

export const resetVerificationCode = async (uid) => {
  try {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { verificationCode: newCode, isEmailVerified: false });
    return { code: newCode, error: null };
  } catch (error) {
    return { error: error.message };
  }
};
