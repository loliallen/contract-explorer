import React, {useEffect, useMemo, useState} from 'react';
import Web3 from "web3";
import {getAbiForContract, getContracts, setAbiForContract} from "./store";
import 'highlight.js/styles/github.css';
import Hljs from "highlight.js"
import json from 'highlight.js/lib/languages/json';
import {ethers} from "ethers";

Hljs.registerLanguage('javascript', json);


function App() {
    const [address, setAddress] = useState("")
    const [abi, setAbi] = useState<any[]>([])
    const [account, setAccount] = useState("")
    const [contract, setContract] = useState<any | null>(null)
    const [web3, setWeb3] = useState<Web3 | null>(null)
    const [params, setParams] = useState<Record<string, { type: 'call' | 'send', params: any[] }>>({})
    const [fnRes, setFnRes] = useState<Record<string, any>>({})
    const storedContracts = useMemo(() => getContracts(), [])

    const [strPrice, setStrPrice] = useState("")
    const [show, setShow] = useState(false)

    const onChangeAbi = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setAbi(eval(e.target.value))
    }

    const handleSelectContract = (address: string) => {
        console.log(address)
        if (!web3?.utils.isAddress(address))
            return
        const abi = getAbiForContract(address)
        console.log(abi)
        setAbi(abi)
        setAddress(address)
    }

    useEffect(() => {
        if (abi.length === 0 || !address || !web3)
            return
        const contract = new web3.eth.Contract(abi, address)
        setContract(contract)
        setAbiForContract(address, abi)
    }, [abi, address, web3])
    const ethEnabled = async () => {
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            setAccount(accounts[0])
            return true;
        }
        return false;
    }

    useEffect(() => {
        const connect = async () => {
            const canI = await ethEnabled()
            // @ts-ignore
            const web3cli = new Web3(window.ethereum || Web3.givenProvider)
            console.log(web3cli)
            setWeb3(web3cli)
        }
        connect()
    }, [])
    useEffect(() => {
        if (!contract || !abi)
            return
        const data: Record<string, { type: 'call' | 'send', params: any[] }> = {}
        for (const item of abi) {
            if (item.type === "function") {
                let type: 'call' | 'send';
                if (item.stateMutability === "view") {
                    type = 'call'
                } else {
                    type = 'send'
                }
                data[item.name] = {
                    type,
                    params: []
                }
            }
        }
        setParams(data)
    }, [abi, contract])

    const changeParams = (name: string, index: number, max_length: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const data: any[] = []

        for (let i = 0; i < max_length; i++) {
            if (i === index)
                data.push(e.target.value)
            else {
                const prev_value = params[name].params[i]
                data.push(prev_value || undefined)
            }
        }
        console.log(params[name])
        setParams((p => ({...p, [name]: {type: p[name].type, params: data}})))
    }
    const callContractMethod = async (name: string) => {
        let res: any;
        if (!contract)
            return
        if (params[name].type === 'call') {
            res = await contract.methods[name](...(params[name].params || [])).call({from: account})
        } else {
            res = await contract.methods[name](...params[name].params).send({from: account})
        }
        setFnRes((p => ({...p, [name]: res})))
    }

    return (
        <div className="App">
            <div>
               <input placeholder="strPrice" onChange={e => setStrPrice(e.target.value)}/>
                <button onClick={()=>setShow(p => !p)}>convert</button>
                <h4>{show && Number(Web3.utils.toBN(Web3.utils.toWei(strPrice, "ether")).toString(10))}</h4>
            </div>
            <div>

                <h6>
                    {account}
                </h6>
                <div style={{display: "flex", flexDirection: "column"}}>
                    <input placeholder="Address" onChange={e => setAddress(e.target.value)}/>
                    <select onChange={e => handleSelectContract(e.target.value)} defaultValue="none">
                        {storedContracts.filter(e => web3 ? web3.utils.isAddress(e as string) : true).map(c => <option
                            key={c} value={c || ""}>{c}</option>)}
                        <option value="none">None</option>
                    </select>
                </div>
                <br/>
                <textarea placeholder="Abi" onChange={onChangeAbi}/>
                <br/>
                {contract && <div style={{color: "green"}}>Contract Connected</div>}
            </div>
            <div>
                {abi.map((e, i) => {
                    return <fieldset key={i} style={{
                        padding: ".5rem 2rem",
                        borderTop: "2px solid black",
                        marginTop: "2rem"
                    }}>
                        {e.name && <legend>
                            {e.name}
                        </legend>}
                        <div style={{display: "flex", gap: "4rem"}}>
                            <div style={{flex: 1}}>
                                {e.inputs && e.inputs.map((i: { name: string, type: string }, j: React.Key) =>
                                    <div key={j}>
                                        <input
                                            placeholder={`${i.name} - ${i.type}`}
                                            onChange={changeParams(e.name, Number(j), e.inputs.length)}
                                        />
                                    </div>
                                )}
                                <span>{`${e.type} -> ${e.stateMutability}`}</span>
                                <button
                                    onClick={() => callContractMethod(e.name)}>{params[e.name]?.type ? params[e.name].type : 'call'}</button>
                                <fieldset>
                                    <legend>output</legend>
                                    {fnRes[e.name] && <span
                                        style={{color: "lightgray", fontSize: "13px"}}>{typeof fnRes[e.name]}</span>}
                                    <pre>
                                        {JSON.stringify(fnRes[e.name], null, 2)}
                                    </pre>
                                </fieldset>
                            </div>
                            <pre style={{flex: 1}}><code
                                dangerouslySetInnerHTML={{__html: Hljs.highlight(JSON.stringify(e, null, 2), {language: "json"}).value}}/></pre>
                        </div>
                    </fieldset>
                })}
            </div>
        </div>
    );
}

export default App;
