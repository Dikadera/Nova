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
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { db } from "../firebase.js";

// Initialize a new user profile
export const createUserProfile = async (uid, email, fullName) => {
  try {
    const userRef = doc(db, "users", uid);
    
    // Generate 6-digit OTP
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

    await setDoc(userRef, {
      email: email,
      fullName: fullName || "",
      balance: 0, 
      balance_eur: 0,
      balance_gbp: 0,
      accountNumber: accountNumber,
      role: "customer",
      status: "active",
      verificationCode: verificationCode,
      isEmailVerified: false,
      novaPoints: 5,
      smartSavings: 0,
      createdAt: serverTimestamp()
    });

    return { error: null, verificationCode, accountNumber };
  } catch (error) {
    return { error: error.message, verificationCode: null, accountNumber: null };
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

// Reset verification for new session (2FA)
export const resetUserVerification = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    await updateDoc(userRef, {
      isEmailVerified: false,
      verificationCode: newCode
    });
    return { error: null, verificationCode: newCode };
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
      throw new Error("Invalid One-Time Password (OTP). Please try again.");
    }

    await updateDoc(userRef, {
      isEmailVerified: true,
      verificationCode: null 
    });

    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};

// Generate OTP for a specific transaction
export const generateTransactionOTP = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await updateDoc(userRef, { transactionOTP: code });
    return { error: null, code };
  } catch (e) {
    return { error: e.message };
  }
};

// Verify transaction OTP
export const verifyTransactionOTP = async (uid, code) => {
  try {
    const userSnap = await getDoc(doc(db, "users", uid));
    const data = userSnap.data();
    if (data.transactionOTP !== code) throw new Error("Invalid Transaction OTP.");
    await updateDoc(doc(db, "users", uid), { transactionOTP: null });
    return { error: null };
  } catch (e) {
    return { error: e.message };
  }
};

// Create a new transaction (transfer funds)
export const createTransaction = async (uid, amount, recipientAccount, description, transferType = 'internal', currency = 'USD') => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) throw new Error("User not found");
    const userData = userSnap.data();

    // Map currency fields
    let balanceField = "balance";
    if (currency === "EUR") balanceField = "balance_eur";
    if (currency === "GBP") balanceField = "balance_gbp";

    const currentBalance = parseFloat(userData[balanceField] || 0);
    
    if (currentBalance < amount) {
      throw new Error(`Insufficient ${currency} funds for this transaction.`);
    }

    // Handle Internal Recipient (Only if internal)
    if (transferType === 'internal') {
       const usersRef = collection(db, "users");
       const q = query(usersRef, where("accountNumber", "==", recipientAccount));
       const querySnapshot = await getDocs(q);
       
       if (querySnapshot.empty) {
         throw new Error("Recipient account not found within Nova Bank. Please use External Transfer for other banks.");
       }
       
       const recipientDoc = querySnapshot.docs[0];
       const recipientRef = doc(db, "users", recipientDoc.id);
       const recipientBalance = parseFloat(recipientDoc.data()[balanceField] || 0);

       // Credit recipient
       await updateDoc(recipientRef, {
         [balanceField]: recipientBalance + amount
       });
       
       // Log for recipient
       await addDoc(collection(db, "transactions"), {
         userId: recipientDoc.id,
         amount: amount,
         senderAccount: userData.accountNumber,
         description: "Inward Transfer",
         status: "completed",
         type: "deposit",
         currency: currency,
         timestamp: serverTimestamp()
       });
    }

    // Deduct from sender (Always)
    await updateDoc(userRef, {
      [balanceField]: currentBalance - amount
    });

    // Log for sender
    await addDoc(collection(db, "transactions"), {
      userId: uid,
      amount: -amount,
      recipientAccount,
      description: description || "Transfer Out",
      status: "completed",
      type: "transfer",
      currency: currency,
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

export const adminUpdateBalance = async (uid, amount, type, customDescription, currency = 'USD') => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) throw new Error("User not found");
    
    // Map currency fields
    let balanceField = "balance";
    if (currency === "EUR") balanceField = "balance_eur";
    if (currency === "GBP") balanceField = "balance_gbp";

    const currentBalance = parseFloat(userSnap.data()[balanceField] || 0);
    const numAmount = parseFloat(amount);
    const newBalance = type === 'credit' ? currentBalance + numAmount : currentBalance - numAmount;
    
    await updateDoc(userRef, { [balanceField]: newBalance });
    
    await addDoc(collection(db, "transactions"), {
      userId: uid,
      amount: type === 'credit' ? numAmount : -numAmount,
      recipientAccount: "Central Bank Transfer",
      description: customDescription || (type === 'credit' ? "Inward Deposit" : "Internal Service Fee"),
      status: "completed",
      type: "system_adjustment",
      currency: currency,
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

// Increment Nova Points and Smart Savings on login
export const incrementUserRewards = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      const currentPoints = data.novaPoints || 0;
      const currentSavings = data.smartSavings || 0;
      
      await updateDoc(userRef, {
        novaPoints: (currentPoints || 0) + 5,
        smartSavings: (currentSavings || 0) + 120.50
      });
    }
    return { error: null };
  } catch (error) {
    return { error: error.message };
  }
};
