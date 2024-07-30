const fs = require('fs');
const crypto = require('crypto');
const { execSync } = require('child_process');

function iptableBlockIps(ipList) {
    execSync('iptables -F INPUT');
    ipList.forEach(ip => {
        try {
            execSync(`iptables -A INPUT -s ${ip} -j DROP`);
        } catch (error) {
            console.error(`Failed to block IP: ${ip}`, error);
        }
    });
}

function calculateChecksumFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return crypto.createHash('sha256').update(fileContent).digest('hex');
}

function saveChecksumToFile(filePath, checksum) {
    fs.writeFileSync(filePath, checksum, 'utf8');
}

function readChecksumFromFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function readJsonFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
}

const blockedIpFile = '/tmp/blocked-ips.json';
const checksumFilePath = 'checksum.txt';
const checksumFile = readChecksumFromFile(checksumFilePath);
const checksum = calculateChecksumFromFile(blockedIpFile);

if (checksumFile === checksum) {
    console.log('Checksums sao iguais, nenhum ip novo foi bloqueado');
    process.exit(0);
}

console.log(`Novo Checksum salvo ${checksum}`);
saveChecksumToFile(checksumFilePath, checksum);

console.log('Novos ips bloqueados');
const blockedIps = readJsonFile(blockedIpFile);
iptableBlockIps(blockedIps);
