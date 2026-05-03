import { useMemo, useState } from "react";
import { Box, Container, Typography } from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import { useNavigate } from "react-router-dom";

import "./style.css";

import { useBuyStockMutation } from "../../services/trade/useBuyStockMutation";
import { useSellStockMutation } from "../../services/trade/useSellStockMutation";
import { useAccountHoldingsQuery } from "../../services/account/useAccountHoldingsQuery";
import { useAccountListQuery } from "../../services/account/useAccountListQuery";
import { useDeleteAccountMutation } from "../../services/account/useDeleteAccountMutation.ts";
import { useAuthStore } from "../../store/auto/useAuthStore";
import { useLogoutMutation } from "../../services/cms/useAuthQuery.ts";

import AddAccountDialog from "../../components/account/AddAccountDialog";
import TradeFunnelDialog from "../../components/trade/TradeFunnelDialog";
import type { TradeDraft } from "../../components/trade/TradeFunnelDialog";
import CashFunnelDialog from "../../components/account/CashFunnelDialog";

type TradeSide = "BUY" | "SELL";

type Account = {
    accountId: number;
    accountName?: string | null;
    brokerName?: string | null;
    accountNumber?: string | null;
    cashBalance?: string | number | null;
    stockAssetValue?: string | number | null;
    totalAssetValue?: string | number | null;
    holdingCount?: number | null;
};

const toNumber = (v: string | number | null | undefined) => {
    if (v == null) return 0;
    if (typeof v === "number") return v;
    const n = Number(String(v).replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
};

const formatCurrency = (value: number) => {
    return `₩${Math.round(value).toLocaleString("ko-KR")}`;
};

export default function AccountPage() {
    const [openAdd, setOpenAdd] = useState(false);

    const [openTrade, setOpenTrade] = useState(false);
    const [tradeSide, setTradeSide] = useState<TradeSide>("BUY");

    const [openCash, setOpenCash] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    const {
        data: accounts = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useAccountListQuery();

    const typedAccounts = accounts as Account[];

    const totalAsset = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.totalAssetValue),
            0
        );
    }, [typedAccounts]);

    const totalCash = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.cashBalance),
            0
        );
    }, [typedAccounts]);

    const totalStock = useMemo(() => {
        return typedAccounts.reduce(
            (sum, a) => sum + toNumber(a.stockAssetValue),
            0
        );
    }, [typedAccounts]);

    const {
        data: holdings = [],
        refetch: refetchHoldings,
    } = useAccountHoldingsQuery(
        selectedAccount ? Number(selectedAccount.accountId) : undefined,
        openTrade && tradeSide === "SELL"
    );

    const { mutate: deleteAccount } = useDeleteAccountMutation();

    const navigate = useNavigate();
    const logout = useAuthStore((s) => s.logout);
    const { mutateAsync: logoutMutateAsync } = useLogoutMutation();

    const { mutateAsync: buyStockMutateAsync } = useBuyStockMutation();
    const { mutateAsync: sellStockMutateAsync } = useSellStockMutation();

    const handleLogout = async () => {
        const ok = window.confirm("로그아웃 하시겠습니까?");
        if (!ok) return;

        try {
            await logoutMutateAsync();
        } catch (e) {
            console.error(e);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const openTradeModal = (account: Account, side: TradeSide) => {
        setSelectedAccount(account);
        setTradeSide(side);
        setOpenTrade(true);
    };

    const closeTrade = () => {
        setOpenTrade(false);
    };

    const openCashModal = (account: Account) => {
        setSelectedAccount(account);
        setOpenCash(true);
    };

    const closeCash = () => {
        setOpenCash(false);
    };

    const handleSubmitTrade = async (draft: TradeDraft) => {
        try {
            const tradeDateTime = `${draft.tradeDate}T09:00:00`;

            if (draft.type === "BUY") {
                if (draft.market !== "KR") {
                    alert("현재는 국내 주식 매수만 지원합니다.");
                    return;
                }

                await buyStockMutateAsync({
                    accountId: Number(draft.accountId),
                    symbolCode: draft.symbolCode,
                    quantity: draft.quantity,
                    price: draft.price,
                    tradeDate: tradeDateTime,
                    memo: draft.memo,
                });

                await refetch();
                closeTrade();
                alert("매수 등록이 완료되었습니다.");
                return;
            }

            if (draft.type === "SELL") {
                if (draft.market !== "KR") {
                    alert("현재는 국내 주식 매도만 지원합니다.");
                    return;
                }

                await sellStockMutateAsync({
                    accountId: Number(draft.accountId),
                    symbolCode: draft.symbolCode,
                    quantity: draft.quantity,
                    price: draft.price,
                    tradeDateTime,
                    memo: draft.memo,
                    fee: 0,
                    tax: 0,
                });

                await Promise.all([refetch(), refetchHoldings()]);
                closeTrade();
                alert("매도 등록이 완료되었습니다.");
            }
        } catch (e) {
            console.error(e);
            alert(e instanceof Error ? e.message : "매매 등록 중 오류가 발생했습니다.");
        }
    };

    const handleSubmitCash = async () => {
        /*
          TODO:
          입금/인출 API가 생기면 여기서 mutation 연결하면 됨.

          예)
          await depositMutateAsync({
              accountId,
              amount,
              memo,
          });

          await withdrawMutateAsync({
              accountId,
              amount,
              memo,
          });
        */

        await refetch();
        closeCash();
        alert("입출금 기능은 화면 흐름까지 연결되었습니다. API 연결 후 실제 반영됩니다.");
    };

    return (
        <Box className="account-page">
            <Container maxWidth="sm" disableGutters className="account-container">
                <header className="account-header">
                    <div>
                        <Typography className="account-header__eyebrow">
                            자산 관리
                        </Typography>
                        <Typography className="account-header__title">
                            증권 계좌
                        </Typography>
                    </div>

                    <button
                        type="button"
                        className="account-header__logout"
                        onClick={handleLogout}
                        aria-label="logout"
                    >
                        <LogoutRoundedIcon />
                    </button>
                </header>

                <section className="account-total-card">
                    <div className="account-total-card__top">
                        <div>
                            <span>총 자산</span>
                            <strong>{formatCurrency(totalAsset)}</strong>
                        </div>

                        <div className="account-total-card__icon">
                            <AccountBalanceWalletRoundedIcon />
                        </div>
                    </div>

                    <div className="account-total-card__summary">
                        <div>
                            <span>현금</span>
                            <strong>{formatCurrency(totalCash)}</strong>
                        </div>
                        <div>
                            <span>보유 주식</span>
                            <strong>{formatCurrency(totalStock)}</strong>
                        </div>
                    </div>
                </section>

                <main className="account-body">
                    <div className="account-section-header">
                        <div>
                            <strong>내 계좌</strong>
                            <p>
                                계좌 카드를 누르면 입금/인출을 등록할 수 있습니다.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="account-add-small-button"
                            onClick={() => setOpenAdd(true)}
                        >
                            <AddRoundedIcon />
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="account-state-card">
                            불러오는 중...
                        </div>
                    ) : isError ? (
                        <div className="account-state-card is-error">
                            {error instanceof Error ? error.message : "오류가 발생했습니다."}
                        </div>
                    ) : typedAccounts.length === 0 ? (
                        <section className="account-empty-card">
                            <div className="account-empty-card__icon">
                                <ReceiptLongRoundedIcon />
                            </div>
                            <strong>등록된 계좌가 없습니다</strong>
                            <p>첫 계좌를 추가하고 자산 관리를 시작해보세요.</p>

                            <button
                                type="button"
                                className="account-primary-button"
                                onClick={() => setOpenAdd(true)}
                            >
                                <AddRoundedIcon />
                                첫 계좌 추가하기
                            </button>
                        </section>
                    ) : (
                        <section className="account-swipe-wrap">
                            {typedAccounts.map((a) => {
                                const cash = toNumber(a.cashBalance);
                                const stock = toNumber(a.stockAssetValue);
                                const total = toNumber(a.totalAssetValue);
                                const holdingCount = a.holdingCount ?? 0;

                                return (
                                    <article
                                        key={a.accountId}
                                        className="account-card"
                                        onClick={() => openCashModal(a)}
                                    >
                                        <div className="account-card__top">
                                            <div className="account-card__title-box">
                                                <strong>{a.accountName || a.brokerName}</strong>
                                                <span>{a.brokerName}</span>
                                                <p>{a.accountNumber}</p>
                                            </div>

                                            <button
                                                type="button"
                                                className="account-card__delete"
                                                aria-label="delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const ok = window.confirm("이 계좌를 삭제할까요?");
                                                    if (!ok) return;
                                                    deleteAccount(a.accountId);
                                                }}
                                            >
                                                <DeleteOutlineRoundedIcon />
                                            </button>
                                        </div>

                                        <div className="account-card__asset">
                                            <span>총 자산</span>
                                            <strong>{formatCurrency(total)}</strong>
                                            <p>보유 종목 {holdingCount}개</p>
                                        </div>

                                        <div className="account-card__summary">
                                            <div>
                                                <span>현금</span>
                                                <strong>{formatCurrency(cash)}</strong>
                                            </div>
                                            <div>
                                                <span>보유 주식</span>
                                                <strong>{formatCurrency(stock)}</strong>
                                            </div>
                                        </div>

                                        <div className="account-card__actions">
                                            <button
                                                type="button"
                                                className="account-trade-button is-buy"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openTradeModal(a, "BUY");
                                                }}
                                            >
                                                <ArrowDownwardRoundedIcon />
                                                매수
                                            </button>

                                            <button
                                                type="button"
                                                className="account-trade-button is-sell"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openTradeModal(a, "SELL");
                                                }}
                                            >
                                                <ArrowUpwardRoundedIcon />
                                                매도
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </section>
                    )}
                </main>
            </Container>

            <button
                type="button"
                className="account-floating-button"
                onClick={() => setOpenAdd(true)}
            >
                <AddRoundedIcon />
            </button>

            <AddAccountDialog
                open={openAdd}
                onClose={() => setOpenAdd(false)}
                onSuccess={async () => {
                    await refetch();
                }}
            />

            <TradeFunnelDialog
                open={openTrade}
                onClose={closeTrade}
                account={selectedAccount}
                holdings={holdings}
                onSubmit={handleSubmitTrade}
                initialSide={tradeSide}
            />

            <CashFunnelDialog
                open={openCash}
                onClose={closeCash}
                account={selectedAccount}
                onSubmit={handleSubmitCash}
            />
        </Box>
    );
}