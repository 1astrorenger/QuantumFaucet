require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ethers } = require('ethers');

const app = express();
app.use(cors());
app.use(express.json());

// Конфигурация
const PORT = process.env.PORT || 3000;
const RPC_URL = process.env.RPC_URL || 'https://testnet-rpc.monad.xyz';
const FAUCET_PRIVATE_KEY = process.env.FAUCET_PRIVATE_KEY;
const TOKEN_CONTRACT_ADDRESS = process.env.TOKEN_CONTRACT_ADDRESS;
const AMOUNT_TO_SEND = ethers.parseUnits("100", 18); // 100 токенов

// Проверка переменных окружения
if (!FAUCET_PRIVATE_KEY || !TOKEN_CONTRACT_ADDRESS) {
    console.error('Error: Missing FAUCET_PRIVATE_KEY or TOKEN_CONTRACT_ADDRESS in .env');
    process.exit(1);
}

// Подключение к сети Monad
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(FAUCET_PRIVATE_KEY, provider);

// ABI для ERC20 токена
const ERC20_ABI = [
    "function transfer(address to, uint amount) returns (bool)",
    "function balanceOf(address account) view returns (uint)"
];

const tokenContract = new ethers.Contract(TOKEN_CONTRACT_ADDRESS, ERC20_ABI, wallet);

// Роут для выдачи токенов
app.post('/faucet', async (req, res) => {
    try {
        const { address } = req.body;
        
        if (!ethers.isAddress(address)) {
            return res.status(400).json({ error: 'Invalid address' });
        }

        const tx = await tokenContract.transfer(address, AMOUNT_TO_SEND);
        await tx.wait();

        res.json({ 
            success: true, 
            txHash: tx.hash,
            amount: ethers.formatUnits(AMOUNT_TO_SEND, 18)
        });
    } catch (error) {
        console.error('Faucet error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Проверка баланса
app.get('/balance', async (req, res) => {
    try {
        const balance = await tokenContract.balanceOf(wallet.address);
        res.json({ balance: ethers.formatUnits(balance, 18) });
    } catch (error) {
        console.error('Balance error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Faucet server running on port ${PORT}`);
    console.log(`Faucet address: ${wallet.address}`);
});