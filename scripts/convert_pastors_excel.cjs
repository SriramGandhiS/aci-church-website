const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const excelPath = 'C:/Users/iamra/Downloads/Updated_List_Pastor_Details till TN 852.xlsx';
const workbook = XLSX.readFile(excelPath);

const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log('Total rows parsed:', rows.length);

const cleanStr = (val) => {
  if (val === undefined || val === null) return '';
  return String(val).trim().replace(/\r\n/g, ' ').replace(/\s+/g, ' ');
};

const formatRegNo = (reg) => {
  const c = cleanStr(reg).toUpperCase();
  if (c.startsWith('TN') && !c.startsWith('TN ')) {
    return 'TN ' + c.slice(2);
  }
  return c;
};

const pastors = [];

for (let i = 0; i < rows.length; i++) {
  const r = rows[i];
  const name = cleanStr(r['Name']);
  const regNo = formatRegNo(r['Reg.No'] || r['Reg No'] || r['Reg.No.']);

  // Skip rows without a name or reg number
  if (!name && !regNo) continue;
  if (name.toLowerCase() === 'name') continue;

  const designation = cleanStr(r['Designation'] || r['Office'] || 'Member');
  const office = cleanStr(r['Office'] || 'Pastor');
  const church = cleanStr(r['Church Name']);
  const district = cleanStr(r['District']);
  const state = cleanStr(r['State'] || 'Tamil Nadu');
  const phone = cleanStr(r['Phone No.'] || r['Phone No'] || r['Mobile']);
  const email = cleanStr(r['E-mail Address'] || r['Email']);
  const address = cleanStr(r['Contact Address']);
  const ordinationDate = cleanStr(r['Date of Ordination']);
  const status = cleanStr(r['Status'] || 'Active');
  const qualification = cleanStr(r['Educational Qualification']);
  const dob = cleanStr(r['D.O.B']);
  const gender = cleanStr(r['Gender'] || 'M');
  const spouse = cleanStr(r['Spouse Name']);

  pastors.push({
    id: regNo ? regNo.replace(/\s+/g, '').toLowerCase() : `pastor-${i+1}`,
    sno: i + 1,
    regNo: regNo || `TN ${String(i+1).padStart(4, '0')}`,
    name: name,
    designation: designation,
    office: office,
    church: church,
    district: district,
    state: state,
    phone: phone,
    email: email,
    address: address,
    ordinationDate: ordinationDate,
    status: status || 'Active',
    qualification: qualification,
    dob: dob,
    gender: gender,
    spouse: spouse
  });
}

console.log('Valid pastors extracted:', pastors.length);
console.log('Sample pastor 1:', pastors[0]);
console.log('Sample pastor 2:', pastors[1]);

const outputPath = path.join(__dirname, '../src/data/pastorsData.json');
fs.writeFileSync(outputPath, JSON.stringify(pastors, null, 2), 'utf-8');
console.log('Successfully saved to:', outputPath);
