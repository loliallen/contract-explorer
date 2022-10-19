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
      data[fnItem.name] = {
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
    data[fnItem.name] = { from: "" };
    if (fnItem.stateMutability === "payable") {
      data[fnItem.name].value = "";
    }
  }

  return data;
};
