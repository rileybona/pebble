// import images 

export default function TreeTypes( type ) {
    // define tree type objects TO-DO - Add URL for Image 
    // thale 
    const thale = {
        "requirements": 1,
        "resiliance": 1,
        "value": 1,
        "quote": "The small genome & short life cycle of Thale Cress makes this plant ideal for testing.",
        "url": "https://dummyimage.com/300",
    }
    const thaleObj = new Object(thale)

    // pine 
    const pine = {
        "requirements": 5,
        "resiliance": 2,
        "value": 10,
        "quote": '"Between every two pines is a doorway to a new world." - John Muir',
        "url": "https://dummyimage.com/300",
    }
    const pineObj = new Object(pine)

    // ghostweed
    const ghostweed = {
       "requirements": 10,
        "resiliance": 0,
        "value": 100, 
        "quote": "some folks just aren't cut out for this life"
    }
    const ghostoj = new Object(ghostweed);

    // add them to a map 
    const typeMap = new Map(); 
    typeMap.set("Thale Cress", thaleObj);
    typeMap.set("Pine", pineObj);
    typeMap.set("ghostweed", ghostoj);

    // return object by type param 
    let returnType = typeMap.get(type); 
    return returnType
}