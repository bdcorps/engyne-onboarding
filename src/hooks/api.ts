import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

const getBackendURL = (path: string) => {
  const server = process.env.NEXTAUTH_URL ? process.env.NEXTAUTH_URL : "";

  return server + path;
};

const makeRequest = ({ method, url, data }: any) => {
  return axios({
    method,
    url,
    data,
    headers: {
      "content-type": "application/json",
    },
  });
};

const fetchSites = async (email: string) => {
  console.time("fetchSites");
  const response = await axios.get(getBackendURL(`/api/users/${email}`));
  console.timeEnd("fetchSites");
  return response.data;
};

const useSites = (email: string) => {
  return useQuery(["sites", email], () => fetchSites(email), {
    enabled: !!email,
  });
};

const fetchSite = async (subdomain: string) => {
  const response = await axios.get(getBackendURL(`/api/sites/${subdomain}`));
  return response.data;
};

const useSite = (subdomain: string) => {
  return useQuery(["site", subdomain], () => fetchSite(subdomain), {
    enabled: !!subdomain,
  });
};

const useCreateSite = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const router = useRouter();

  return useMutation(
    (data: any) => {
      const url: string = getBackendURL(`/api/sites`);

      return makeRequest({
        method: "post",
        url,
        data,
      });
    },
    {
      onSuccess: (data: any, variables: any) => {
        queryClient.invalidateQueries("sites");

        router.push(`/sites/${variables.subdomain}`);
        toast({
          title: "New site created.",
          description: `We've created a new site for you.`,
          status: "success",
          duration: 1000,
          isClosable: true,
        });
      },
    }
  );
};


export {
  useSites,
  fetchSites,
  useSite,
  fetchSite,
  useCreateSite,
};

