const validIndustries = [
    "Ramky Recycling",
    "ScrapUncle",
    "Waste Management India",
    "EcoRecycle Pvt Ltd",
    "Green Earth Recycling"
];

function verifyIndustry(industryName) {

    if (!industryName) return false;

    return validIndustries.some(ind =>
        ind.toLowerCase() === industryName.toLowerCase()
    );
}

module.exports = verifyIndustry;