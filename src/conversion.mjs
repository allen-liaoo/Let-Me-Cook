// This module supports conversion between units (divided between volume and mass units)
export function convert(map, value, fromUnit, toUnit) {
    fromUnit = fromUnit.toLowerCase()
    toUnit = toUnit.toLowerCase()
    return (value * map.get(fromUnit)) // converted to standard
        * (1 / map.get(toUnit)) // convert back from standard\
}


// converts then compare between two values, assumes two null units are servings
// returns -1 if v1 < v2
// returns 1 if v1 >= v2
// returns 0 if no comparison could be made
export function compare(value1, unit1, value2, unit2) {
    function comparisonHelper(v1,v2) {
        if (v1 < v2) return -1
        else return 1
    }
  
    // console.log(`Comparing: ${value1} ${unit1} ${value2} ${unit2}`)
    // compare as "servings"
    if (!unit1 && !unit2 &&  // both has no unit
        value1 % 1 === 0 && value2 % 1 === 0) { // and are whole numbers
        return comparisonHelper(value1, value2)
    }
    // can't compare
    if (!unitIsKnown(unit1) || !unitIsKnown(unit2))
        return 0

    const v1ToV2 = convertAny(value1, unit1, unit2)
    if (v1ToV2 === undefined) return 0
    else return comparisonHelper(v1ToV2, value2)
  }

function addConvObjToMap(map, cvObj) {
    for (const uKey in cvObj) {
        const unit = cvObj[uKey]
        for (const u of unit.units) {
            map.set(u, unit.rto)
            map.set(u+'s', unit.rto) // plural
        }
    }
}

// Volume unit conversion

// Default to US cup/pint/... instead of imperial
// rto is the unit's ratio to the standard unit (unit value * rto = std value)
const volumeObj = {
    ml: {
        units: ['milliliter', 'ml', 'cubic centimeter', 'cm^3'],
        rto: 1
    },
    l: {
        units: ['liter', 'l'],
        rto: 1000
    },
    tsp: {
        units: ['teaspoon', 'tsp'],
        rto: 4.92892
    },
    tbsp: {
        units: ['tablespoon', 'tbsp'],
        rto: 14.7868
    },
    floz: {
        units: ['fluid ounce', 'fl oz', 'fl. oz.', 'oz. fl.'],
        rto: 29.5735
    },
    cup: {
        units: ['cup'],
        rto: 240
    },
    pint: {
        units: ['pint', 'pt'],
        rto: 473.176
    },
    quart: {
        units: ['quart', 'qt'],
        rto: 946.353
    },
    gallon: {
        units: ['gallon', 'gal'],
        rto: 3785.41
    },
    m3: {
        units: ['cubic meter', 'm^3'],
        rto: 1e+6
    },
    mm3: {
        units: ['cubic millimeter', 'mm^3'],
        rto: 1e-3
    }
}

const volumeMap = new Map()
addConvObjToMap(volumeMap, volumeObj)
export function convertVolume(value, fromUnit, toUnit) {
    return convert(volumeMap, value, fromUnit, toUnit)
}

// Mass unit conversion
const massObj = {
    g: {
        units: ['gram', 'g'],
        rto: 1
    },
    mg: {
        units: ['milligram', 'mg'],
        rto: 0.001
    },
    kg: {
        units: ['kilogram', 'kg'],
        rto: 1000
    },
    mcg: {
        units: ['microgram', 'mcg'],
        rto: 1e-6
    },
    lb: {
        units: ['pound', 'lb'],
        rto: 453.592
    },
    oz: {
        units: ['ounce', 'oz'],
        rto: 28.3495
    }
}

const massMap = new Map()
addConvObjToMap(volumeMap, massObj)
export function convertMass(value, fromUnit, toUnit) {
    return convert(massMap, value, fromUnit, toUnit)
}

export function convertAny(value, fromUnit, toUnit) {
    // mass as volume conversion fallback
    let res = convertVolume(value, fromUnit, toUnit) 
        ?? convertMass(value, fromUnit, toUnit) 
    return Math.round(res * 100) / 100 // round to 100th place
}

export function unitIsKnown(unit) {
    return unit && (volumeMap.has(unit) || massMap.has(unit))
}