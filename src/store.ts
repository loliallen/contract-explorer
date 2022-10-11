
export const setAbiForContract = (contract_address: string, abi: any) => {
    const str_abi = JSON.stringify(abi)
    localStorage.setItem(contract_address, str_abi)
}

export const getAbiForContract = (contract_address: string) => {
    return JSON.parse(localStorage.getItem(contract_address) || JSON.stringify([]))
}

export const getContracts = () => {
    const contracts = []
    for (let i = 0; i < localStorage.length; i++)
        contracts.push(localStorage.key(i))
    return contracts
}