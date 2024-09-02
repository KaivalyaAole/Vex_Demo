
// VANTA.NET({
//     el: "body",
//     mouseControls: true,
//     touchControls: true,
//     gyroControls: false,
//     minHeight: 200.0,
//     minWidth: 200.0,
//     scale: 1.0,
//     scaleMobile: 1.0,
//     color: 0xbcb8b1,
//     backgroundColor: 0xf4f3ee,
//     points: 9.0,
//     maxDistance: 22.0,
//     spacing: 19.0,
// });



document.addEventListener('DOMContentLoaded', () => {
    let data1, data2, data3;
    let selectedItem, selectedDescItem;
    let currentDisplayMode = 'IR';
    let previousListItem1 = null; // Declare variable to store previous selected list item in column 1
    let previousListItem2 = null; // Declare variable to store previous selected list item in column
    const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';


    function fetchDataAndPopulateLists() {
        // Show loading SVGs
        document.getElementById('loadingSvg1').style.display = 'block';
        document.getElementById('loadingSvg2').style.display = 'block';
        // Fetch data1.json
        fetch(`get_all_code`,
            {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json', 
                    'X-Tab-ID': tabId
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonData => {
                // Hide loading SVGs
                document.getElementById('loadingSvg1').style.display = 'none';
                document.getElementById('loadingSvg2').style.display = 'none';

                file1_id = jsonData['src_id']
                file2_id = jsonData['tgt_id']


                data1 = jsonData[file1_id];

                const itemList = document.getElementById('itemList');
                itemList.innerHTML = ''; // Clear existing items
                for (let key in data1) {
                    // console.log(item)
                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';
                    // listItem.textContent = data1;
                    listItem.textContent = data1[key]['name']

                    listItem.addEventListener('click', () => {

                        document.getElementById('sourceCode2').innerHTML = '';
                        selectedDescItem = null;
                        // selectedItem = item;
                        selectedItem = data1[key]
                        // displayIR(selectedItem, 'sourceCode1');
                        currentDisplayMode = 'IR';
                        displayContent(selectedItem, 'sourceCode1');

                        // Highlight selected item and remove highlight from previous
                        if (previousListItem1) {
                            previousListItem1.classList.remove('selected');
                        }
                        listItem.classList.add('selected');
                        previousListItem1 = listItem;
                        text = String(file1_id) + "-" + String(selectedItem['id'])
                        populateDescriptions(text, file2_id);
                    });

                    itemList.appendChild(listItem);

                }
                data2 = jsonData[file2_id];
                const descriptionList = document.getElementById('descriptionList');
                descriptionList.innerHTML = ''; // Clear existing descriptions
                // data2.forEach(descItem => 
                for (let key in data2) {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';
                    // listItem.textContent = descItem.name;
                    listItem.textContent = data2[key]['name']
                    listItem.addEventListener('click', () => {

                        document.getElementById('sourceCode1').innerHTML = "";
                        selectedItem = null;
                        selectedDescItem = data2[key];
                        // displayIR(selectedDescItem, 'sourceCode2');
                        currentDisplayMode = 'IR';
                        displayContent(selectedDescItem, 'sourceCode2');
                        if (previousListItem1) {
                            previousListItem1.classList.remove('selected');
                        }
                        listItem.classList.add('selected');
                        previousListItem1 = listItem;
                        text = String(file2_id) + "-" + String(selectedDescItem['id'])
                        populateItemsFromData3(text, file1_id);
                    });

                    descriptionList.appendChild(listItem);

                }
            })
            .catch(error => {console.error('Error fetching data.json:', error);
                // Hide loading SVGs in case of error
                document.getElementById('loadingSvg1').style.display = 'none';
                document.getElementById('loadingSvg2').style.display = 'none';
            });
    }

    function populateDescriptions(text, file2_id) {
        let previousListItem1 = null; // Declare variable to store previous selected list item in column 1
        let previousListItem2 = null;
        console.log("working populate descriptions");
        fetch(`get_neighbour_code?text=${encodeURIComponent(text)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Tab-ID': tabId
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonData3 => {
                data3 = jsonData3[file2_id];
                data3 = Object.entries(data3)
                data3.sort((a, b) => b[1].score - a[1].score)



                const descriptionList = document.getElementById('descriptionList');
                descriptionList.innerHTML = '';
                // data3.forEach(descItem => 
                // for (let key2 in data3){
                //     let string_name="";
                //     if(data3[key2][1]['score']>75)
                //         {
                //             string_name="closest";
                //         }
                //     else if(data3[key2][1]['score']>50)
                //         {
                //             string_name= "closer";
                //         }
                //     else{
                //         string_name= "farthest";
                //     }
                //     const listItem = document.createElement('div');
                //     listItem.className = 'list-item'; 
                //     listItem.textContent = data3[key2][1]['name']+" : "+string_name;

                for (let key2 in data3) {
                    let string_name = "";

                    if (key2 === "0") {
                        string_name = "Most Similar";
                    } else if (key2 === (data3.length - 1).toString()) {
                        string_name = "Least Similar";
                    }

                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';
                    if (string_name) {
                        listItem.textContent = data3[key2][1]['name'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + string_name;
                    }
                    else {
                        listItem.textContent = data3[key2][1]['name'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + string_name;
                    }


                    console.log(data3[key2][1]['score'])
                    listItem.addEventListener('click', () => {

                        selectedDescItem = data3[key2][1];
                        // Highlight selected item and remove highlight from previous
                        if (previousListItem1) {
                            previousListItem1.classList.remove('selected');
                        }
                        listItem.classList.add('selected');
                        previousListItem1 = listItem;
                        displayContent(selectedDescItem, 'sourceCode2');

                    });
                    listItem.addEventListener('mouseover', () => {
                        if (data3[key2][1]['score'] > 75) {
                            listItem.style.backgroundColor = 'green';
                        } else if (data3[key2][1]['score'] > 50 && data3[key2][1]['score'] <= 75) {
                            listItem.style.backgroundColor = '#00FF00';
                        }
                        else if (data3[key2][1]['score'] > 25 && data3[key2][1]['score'] <= 50) {
                            listItem.style.backgroundColor = 'orange';
                        } else {
                            listItem.style.backgroundColor = 'red';
                        }
                    });

                    listItem.addEventListener('mouseout', () => {
                        listItem.style.backgroundColor = '';
                    });
                    descriptionList.appendChild(listItem);
                };
            })
            .catch(error => console.error('Error fetching data3.json:', error));
    }

    function populateItemsFromData3(text, file1_id) {
        let previousListItem1 = null; // Declare variable to store previous selected list item in column 1
        let previousListItem2 = null;
        fetch(`get_neighbour_code?text=${encodeURIComponent(text)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Tab-ID': tabId,
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(jsonData3 => {
                data3 = jsonData3[file1_id]
                const itemList = document.getElementById('itemList');
                itemList.innerHTML = ''; // Clear existing items
                data3 = Object.entries(data3)
                data3.sort((a, b) => b[1].score - a[1].score)

                // data3.forEach(item => 
                // for (let key2 in data3)
                // {
                //     let string_name="";
                //     if(data3[key2][1]['score']>75)
                //         {
                //             string_name="closest";
                //         }
                //     else if(data3[key2][1]['score']>50)
                //         {
                //             string_name= "closer";
                //         }
                //     else{
                //         string_name= "farthest";
                //     }
                //     const listItem = document.createElement('div');
                //     listItem.className = 'list-item';
                //     // listItem.textContent = item.name;
                //     listItem.textContent = data3[key2][1]['name']+":"+string_name;

                for (let key2 in data3) {
                    let string_name = "";

                    if (key2 === "0") {
                        string_name = "Most Similar";
                    } else if (key2 === (data3.length - 1).toString()) {
                        string_name = "Least Similar";
                    }

                    const listItem = document.createElement('div');
                    listItem.className = 'list-item';
                    if (string_name) {
                        listItem.textContent = data3[key2][1]['name'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + string_name;
                    }
                    else {
                        listItem.textContent = data3[key2][1]['name'] + "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0" + string_name;
                    }


                    listItem.addEventListener('click', () => {
                        // Set background color based on string_name
                        // console.log(string_name);
                        // if (string_name === "closest") {
                        //     listItem.classList.add('closest-selected');
                        // } else if (string_name === "closer") {
                        //     listItem.classList.add('closer-selected');
                        // } else {
                        //     listItem.classList.add('farthest-selected');
                        // }

                        selectedItem = data3[key2][1];
                        // Highlight selected item and remove highlight from previous
                        if (previousListItem1) {

                            previousListItem1.classList.remove('selected');

                        }
                        listItem.classList.add('selected');
                        previousListItem1 = listItem;
                        // displayIR(item, 'sourceCode1');
                        // displayIR(selectedItem, 'sourceCode1');
                        displayContent(selectedItem, 'sourceCode1');
                    });

                    listItem.addEventListener('mouseover', () => {
                        if (data3[key2][1]['score'] > 75) {
                            listItem.style.backgroundColor = 'green';
                        } else if (data3[key2][1]['score'] > 50 && data3[key2][1]['score'] <= 75) {
                            listItem.style.backgroundColor = '#00FF00';
                        }
                        else if (data3[key2][1]['score'] > 25 && data3[key2][1]['score'] <= 50) {
                            listItem.style.backgroundColor = 'orange';
                        } else {
                            listItem.style.backgroundColor = 'red';
                        }
                    });

                    listItem.addEventListener('mouseout', () => {
                        listItem.style.backgroundColor = '';
                    });
                    itemList.appendChild(listItem);
                }
            })
            .catch(error => console.error('Error fetching data3.json:', error));
    }


    function displaySourceCode(item, sourceCodeId) {
        const sourceCode = document.getElementById(sourceCodeId);
        sourceCode.innerHTML = hljs.highlight(item["source"], { language: 'C' }).value;
    }

    function displayIR(item, sourceCodeId) {
        const sourceCode = document.getElementById(sourceCodeId);
        sourceCode.innerHTML = hljs.highlight(item["IR"], { language: 'x86asm' }).value;
    }

    function displayASM(item, sourceCodeId) {
        console.log(sourceCodeId)
        const sourceCode = document.getElementById(sourceCodeId);
        sourceCode.innerHTML = hljs.highlight(
            item["ASM"],
            { language: 'x86asm' }
        ).value;
    }

    function displayContent(item, sourceCodeId) {
        switch (currentDisplayMode) {
            case 'IR':
                displayIR(item, sourceCodeId);
                break;
            case 'source':
                displaySourceCode(item, sourceCodeId);
                break;
            case 'ASM':
                displayASM(item, sourceCodeId);
                break;
            default:
                break;
        }
    }

    document.getElementById('irButton1').addEventListener('click', () => {
        currentDisplayMode = 'IR';
        if (selectedItem) {
            displayIR(selectedItem, 'sourceCode1');
        }
        if (selectedDescItem) {
            displayIR(selectedDescItem, 'sourceCode2');
        }
    });

    document.getElementById('sourceButton1').addEventListener('click', () => {
        currentDisplayMode = 'source';
        if (selectedItem) {
            displaySourceCode(selectedItem, 'sourceCode1');
        }
        if (selectedDescItem) {
            displaySourceCode(selectedDescItem, 'sourceCode2');
        }
    });

    document.getElementById('asmButton1').addEventListener('click', () => {
        currentDisplayMode = 'ASM';
        if (selectedItem) {
            displayASM(selectedItem, 'sourceCode1');
        }
        if (selectedDescItem) {
            displayASM(selectedDescItem, 'sourceCode2');
        }
    });

    function resetPage() {
        selectedItem = null;
        selectedDescItem = null;
        currentDisplayMode = 'IR';
        document.getElementById('itemList').innerHTML = '';
        document.getElementById('descriptionList').innerHTML = '';
        document.getElementById('sourceCode1').innerHTML = '';
        document.getElementById('sourceCode2').innerHTML = '';
        fetchDataAndPopulateLists(); // Re-fetch data and populate lists
    }


    document.getElementById('resetButtonList').addEventListener('click', resetPage);
    document.getElementById('resetButtonDescription').addEventListener('click', resetPage);

    // Initial fetch and populate
    fetchDataAndPopulateLists();
});
