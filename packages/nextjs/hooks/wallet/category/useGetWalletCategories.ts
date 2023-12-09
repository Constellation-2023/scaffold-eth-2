"use client";

import { Wallet, WalletCategory } from "@prisma/client";
import axios from "axios";
import { useQuery } from "react-query";

export const QUERY_KEY_FOR_WALLET_CATEGORIES = "key-subject-details";

type TResponse = { data: (WalletCategory & { wallets: Wallet[] })[] };
type Props = { userId?: string };
const getData = async ({ userId }: Props): Promise<TResponse> => {
  const url = `/api/auth/wallet/category`;
  const config = {
    headers: {
      Accept: "application/json",
    },
    params: {
      userId,
    },
  };

  const response = await axios.get(url, config);
  return response.data as TResponse;
};
export const useGetWalletCategories = ({ userId }: Props = {}) => {
  const queryData = useQuery([QUERY_KEY_FOR_WALLET_CATEGORIES, userId], () => getData({ userId }), {
    //   enabled: props.keySubjectAddress !== undefined,
    //   onError: (err: any) => {},
    //   onSuccess: (data) => {},
  });

  return queryData;
};
