const DMap = new Map([
    ['ADM Fin.& Acct.', 'ADM-FA'],
    ['ADM Gen.Mgt', 'ADM-GM'], 
    ['ADM HR', 'ADM-HR'], 
    ['MFG Manufactur', 'MFG-MFT'], 
    ['MFG PPIC', 'MFG-PPIC'], 
    ['MFG Production', 'MFG-PROD'], 
    ['MFG Purchasing', 'MFG-PURC'], 
    ['MFG Technical', 'MFG-TECH'], 
    ['MFG Warehouse', 'MFG-WRH'], 
    ['MKT Marketing', 'MKT-MKT'], 
    ['MKT Sales&Distr', 'MKT-SD'], 
    ['R&D QC/QA', 'RND-QCA'], 
    ['R&D Resrch.Dev.', 'RND-RD']
])

const BMap = new Map([
    ['ICBP-Noodle Head Office', 'N001'], 
    ['ICBP-Noodle DKI', 'N002'], 
    ['ICBP-Noodle Cibitung', 'N003'], 
    ['ICBP-Noodle Tangerang', 'N004'], 
    ['ICBP-Noodle Bandung', 'N005'], 
    ['ICBP-Noodle Semarang', 'N006'], 
    ['ICBP-Noodle Surabaya', 'N007'], 
    ['ICBP-Noodle Medan', 'N008'], 
    ['ICBP-Noodle Cirebon', 'N009'], 
    ['ICBP-Noodle Pekanbaru', 'P001'], 
    ['ICBP-Noodle Palembang', 'P002'], 
    ['ICBP-Noodle Lampung', 'P003'], 
    ['ICBP-Noodle Banjarmasin', 'P004'], 
    ['ICBP-Noodle Pontianak', 'P005'], 
    ['ICBP-Noodle Manado', 'P006'], 
    ['ICBP-Noodle Makassar', 'P007'], 
    ['ICBP-Noodle Jambi', 'P008'], 
    ['ICBP-Noodle Tj. Api Api', 'P009']
])



export function toIDDept(e: string) {
    return DMap.get(e) || "ID tidak ditemukan";
}

export function toIDBranch(e: string) {
    return BMap.get(e) || "ID tidak diotemukan";
}

const reverseDMap = new Map([
    ['ADM-FA', 'ADM Fin.& Acct.'],
    ['ADM-GM', 'ADM Gen.Mgt'],
    ['ADM-HR', 'ADM HR'],
    ['MFG-MFT', 'MFG Manufactur'],
    ['MFG-PPIC', 'MFG PPIC'],
    ['MFG-PROD', 'MFG Production'],
    ['MFG-PURC', 'MFG Purchasing'],
    ['MFG-TECH', 'MFG Technical'],
    ['MFG-WRH', 'MFG Warehouse'],
    ['MKT-MKT', 'MKT Marketing'],
    ['MKT-SD', 'MKT Sales&Distr'],
    ['RND-QCA', 'R&D QC/QA'],
    ['RND-RD', 'R&D Resrch.Dev.']
]);

const reverseBMap = new Map([
    ['N001', 'ICBP-Noodle Head Office'],
    ['N002', 'ICBP-Noodle DKI'],
    ['N003', 'ICBP-Noodle Cibitung'],
    ['N004', 'ICBP-Noodle Tangerang'],
    ['N005', 'ICBP-Noodle Bandung'],
    ['N006', 'ICBP-Noodle Semarang'],
    ['N007', 'ICBP-Noodle Surabaya'],
    ['N008', 'ICBP-Noodle Medan'],
    ['N009', 'ICBP-Noodle Cirebon'],
    ['P001', 'ICBP-Noodle Pekanbaru'],
    ['P002', 'ICBP-Noodle Palembang'],
    ['P003', 'ICBP-Noodle Lampung'],
    ['P004', 'ICBP-Noodle Banjarmasin'],
    ['P005', 'ICBP-Noodle Pontianak'],
    ['P006', 'ICBP-Noodle Manado'],
    ['P007', 'ICBP-Noodle Makassar'],
    ['P008', 'ICBP-Noodle Jambi'],
    ['P009', 'ICBP-Noodle Tj. Api Api']
]);

export { reverseDMap, reverseBMap };

export function toNameDept(id: string) {
    return reverseDMap.get(id) || "Nama Departemen tidak ditemukan";
}

export function toNameBranch(id: string) {
    return reverseBMap.get(id) || "Nama Cabang tidak ditemukan";
}
