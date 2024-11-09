let accessData = JSON.parse(localStorage.getItem("accessData"))
let mainTabIndex = 0
let selSubTab = 'All'


async function handleSelectTab (index) {
    await resetMainContent()
    console.log(index,'index')
    mainTabIndex = index
    const doc = document.getElementById("main-tabs")
    Array.from(doc.children).forEach(async(elem, i) => {
        if ((i-1) === index) {
            elem.className = 'active';
        } else {
            elem.className = '';
        }
    });
    if(index===0){
        accessData.forEach((elem,i)=> {
            console.log(Object.values(elem.data),'Object.values(elem.data)')
            loadContent(Object.values(elem.data).flat())
        })
    }else{
        console.log(selSubTab,'selSubTab')
        if(selSubTab==='All'){
            loadContent(Object.values(accessData[mainTabIndex-1].data).flat())
        }else{
            loadContent(accessData[mainTabIndex-1].data[selSubTab])
        }
    }
}

async function handleSelectSubTab(index) {
    await resetMainContent()
    
    const mainDoc = document.getElementById("sub-tabs")
    Array.from(mainDoc.children).forEach((elem) => elem.className = '');
    mainDoc.children[index].className = "active"
    
    const mainIndex = mainTabIndex===0 ? 0 : mainTabIndex-1
    console.log(mainIndex,'mainTabIndex',index-1)
    if(index===0){
        selSubTab = "All"
        if(mainTabIndex===0){
            accessData.forEach((elem,i)=> {
                loadContent(Object.values(elem.data).flat())
            })
        }else{
            loadContent(Object.values(accessData[mainIndex].data).flat())
        }
    }else{
        subTabName = Object.keys(accessData[mainIndex].data)[index-1]
        selSubTab = subTabName
        console.log(subTabName,'subTabIndex')
        if(mainTabIndex===0){
            accessData.forEach((elem,i)=> {
                loadContent(elem.data[subTabName])
            })
        }else{
            loadContent(accessData[mainIndex].data[subTabName])
        }
    }
}

async function updateFile() {
    const [fileHandle] = await window.showOpenFilePicker();
    
    const writeable = await fileHandle.requestPermission({ mode: 'readwrite' });
    if (writeable !== 'granted') {
        alert('Write permission is needed to update the file.');
        return;
    }
    
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(accessData);
    await writableStream.close();
    
    alert('File updated successfully!');
}

async function resetMainTab() {
    const mainTabs = document.getElementById("main-tabs");
    const firstChild = mainTabs.children[0];
    const secondChild = mainTabs.children[1];

    document.getElementById("main-tabs").innerHTML = ""

    mainTabs.appendChild(firstChild)
    mainTabs.appendChild(secondChild)
}
async function resetSubTab() {
    const mainDoc = document.getElementById("sub-tabs")
    Array.from(mainDoc.children).forEach((elem) => elem.className = '');
    mainDoc.children[0].className = "active"
}
async function resetMainContent() {
    document.getElementById("main-content").innerHTML = "";
}

async function restoreData () {
    const data = await fetch('./data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('File Not Found');
            }
            return response.json();
        })
        .then(async (data) => {
            await resetMainTab()
            await resetSubTab()
            await resetMainContent()
            console.log('Fetched JSON Data:', data);
            loadData(data)
            localStorage.setItem("accessData", JSON.stringify(data))
        })
        .catch(error => {
            console.error('Error fetching JSON file:', error);
        });
    return data
}

function loadContent (arr) {
    for (let i = 0; i < arr.length; i++) {  
        const mainTabs = document.getElementById("main-content")
        const rowdiv = document.createElement('div')
        const roInput = document.createElement('input')
        const contentdiv = document.createElement('div')
        rowdiv.className = 'content-row'
    
        roInput.placeholder = "Labels"
        roInput.value = arr[i].label
        rowdiv.appendChild(roInput)
        
        contentdiv.className = "data-content"
        contentdiv.innerHTML = arr[i].value
        // contentdiv.setAttribute("contenteditable", "true")
        rowdiv.appendChild(contentdiv)
    
        mainTabs.appendChild(rowdiv)
    }
}

async function loadData (data) {
    console.log(data,'data')
    const mainTabs = document.getElementById("main-tabs")
    data.forEach((elem,i) => {
        const div = document.createElement('div')
        div.onclick = () => handleSelectTab(i+1)
        div.innerHTML = elem.name
        mainTabs.appendChild(div)


        loadContent(Object.values(elem.data))
    });
    handleSelectTab(0)

    
}

loadData(accessData)