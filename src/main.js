import {
    calculateChecksumFromFile,
    iptablesBlockIps,
    readChecksumFromFile,
    readJsonFile,
    saveChecksumToFile
} from "./util/functions.js";

const blockedIpFile = '/opt/asterisk-api-environment/asterisk/blocked-ips.json';
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
iptablesBlockIps(blockedIps);
