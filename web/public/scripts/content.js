const checkAndAdd = (extractedObjects, element, checkAttributeList) => {
  const requiredText=element?.lastChild?.textContent?.trim() || ""

  const includesAll =
    (
      // Element must include all the checkList
      checkAttributeList?.every((item) => {return element?.id?.toLowerCase()?.includes(item?.toLowerCase())})      ||
      //  Atleast one Class Name must include all the checklist
      checkAttributeList?.every((item) => element?.classList?.length > 0 && [...element?.classList].some(className => className?.toLowerCase()?.includes(item?.toLowerCase())))      ||
      //  Atleast one attribute must include all the checklist
      checkAttributeList?.every((item) => [...element?.attributes].some(attribute => attribute?.value?.toLowerCase()?.includes(item?.toLowerCase())))
    )
    // Only add new types
    const typeAlreadyExists = extractedObjects.some(obj => obj.type === checkAttributeList[0]);

    
  // If the element includes all the tags that we passed, then add the element to our array
  if (includesAll && !typeAlreadyExists && requiredText.length>0) {
    extractedObjects.push({
      // Passing 0th value, we put the main information type(name, price,...etc) in the first element
      type: checkAttributeList[0],
      // Getting the last nth child of the element to ensure we get the correct value
      value:requiredText
    })
  }
}

const extractArticleData = () => {
  const extractedObjects = []

  document.querySelectorAll("*").forEach((element) => {
    // Images
    if (element.tagName.toLowerCase() === "img") {
      extractedObjects.push({
        type: "image",
        value:element?.src
      })
      return;
    }

    // Title
    checkAndAdd(extractedObjects,element,["title","product"])
    // Prices
    checkAndAdd(extractedObjects,element,["price","product"])
    checkAndAdd(extractedObjects,element,["price"])
    // Different types of descriptions maybe? :)
    checkAndAdd(extractedObjects,element,["description","product"])
    checkAndAdd(extractedObjects,element,["detail","product"])
    checkAndAdd(extractedObjects,element,["facts","product"])
    // Brands
    checkAndAdd(extractedObjects,element,["brand","product"])
    checkAndAdd(extractedObjects,element,["category","product"])
    // Reviews
    checkAndAdd(extractedObjects,element,["review","summary"])
    // Miscellaneous
    checkAndAdd(extractedObjects,element,["availability","product"])
    checkAndAdd(extractedObjects,element,["warranty","product"])
    
  })


  return extractedObjects
}



  window.addEventListener("load", () => {
    const extractedData = extractArticleData();
    // GET PAGE URL
    const pageUrl = document.URL;
    const data = {
      page_url: pageUrl,
      extracted_data: extractedData,
    };
    // Only send to background script if its a legit product detail website i.e has product title
    if(extractedData?.find(e=>e?.type=="title")){
      chrome.runtime.sendMessage(data);
    }
    
  });

