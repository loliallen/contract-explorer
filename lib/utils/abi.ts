import crypto from "crypto-js";

export const configureParams = (abi: any[]) => {
  const data: Record<string, { type: "call" | "send"; params: any[] }> = {};

  for (const fnItem of abi) {
    if (fnItem.type === "function") {
      let type: "call" | "send";
      if (fnItem.stateMutability === "view") {
        type = "call";
      } else {
        type = "send";
      }
      data[fnItem.hash] = {
        type,
        params: [],
      };
    }
  }

  return data;
};

export const configureArgs = (abi: any[]) => {
  const data: Record<string, { from: string; value?: string }> = {};

  for (const fnItem of abi) {
    data[fnItem.hash] = { from: "" };
    if (fnItem.stateMutability === "payable") {
      data[fnItem.hash].value = "";
    }
  }

  return data;
};

export const configureAbi = (abi: any[]) => {
  for (let abiItem of abi) {
    const hash = crypto.MD5(JSON.stringify(abiItem)).toString();
    abiItem["hash"] = hash;
  }
  return abi;
};
