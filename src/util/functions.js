import {execSync} from "child_process";
import fs from "fs";
import crypto from "crypto";

export function iptablesBlockIps(ipList) {
    execSync('iptables -F INPUT');
    ipList.forEach(ip => {
        try {
            execSync(`iptables -A INPUT -s ${ip} -j DROP`);
        } catch (error) {
            console.error(`Failed to block IP: ${ip}`, error);
        }
    });
}

export function calculateChecksumFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
}

export function saveChecksumToFile(filePath, checksum) {
    fs.writeFileSync(filePath, checksum, 'utf8');
}

export function readChecksumFromFile(filePath) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
        console.error(`Falha ao ler chacksum: ${filePath}`, error);
        return "0";
    }
}

export function readJsonFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
}