const TRANSACTION_STATUS = {
    PENDING: "pending",
    CANCELED: "canceled",
    IN_PROGRESS: "in progress",
    COMPLETED: "completed"
};
const TRANSACTION_TYPE={
    DEBIT:"Debit",
    CREDIT:"Credit"
}
const ROLES={
ADMIN:"ADMIN",
USER:"USER"
}
const BANKNAME="Access Bank"
const TRANSACTION_NAME= {
    DEPOSIT:"Deposit",
    TRANSFER:"Transfer",
    WITHDRAWAL:"Withdrawal"
}
const ACCOUNTTYPE= {
SAVING:"savings",
CHECKING:"checking",
OTHERS:"other"
}
module.exports = {
    TRANSACTION_STATUS,
    TRANSACTION_TYPE,
    ROLES,
    BANKNAME,
    TRANSACTION_NAME,
    ACCOUNTTYPE
};
