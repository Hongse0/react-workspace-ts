export type BrokerageAccountCreate = {
    brokerage: string;      // 증권사
    name: string;           // 계좌명
    accountNumber: string;  // 계좌번호
    initialBalance: number; // 초기 잔액
};
