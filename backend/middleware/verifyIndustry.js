const validIndustries = [
  { name: "EcoRecycle Ltd", regNo: "IND12345" },
  { name: "GreenCycle Pvt", regNo: "IND67890" }
];

function verifyIndustry(req, res, next) {
  const { role, industryName, regNo } = req.body;

  if (role === "industry") {
    const valid = validIndustries.some(
      i => i.name === industryName && i.regNo === regNo
    );
    if (!valid) return res.status(400).json({ message: "Industry not verified" });
  }

  next();
}

module.exports = verifyIndustry;