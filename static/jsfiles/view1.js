var ls_points = []
var init_data, init_layout;
let side_bar_content = null;
var minx1, miny1, minz1;
var maxx1, maxy1, maxz1;
var minx2, miny2, minz2;
var maxx2, maxy2, maxz2;
var tabid = sessionStorage.getItem('tabId');
var source_filename = localStorage.getItem(`FILE_1_${tabid}`);
var target_filename = localStorage.getItem(`FILE_2_${tabid}`);
var plotlyInitialized = false;

if (!source_filename) { source_filename = "binary-1"; }

if (!target_filename) { target_filename = "binary-2"; }

// Fallback for plotly
window.addEventListener('load', () => {
  const svgElements = [
    document.getElementById('plotly-loadingSvg'),
  ];
  svgElements.forEach(svg => {
    if (svg){
      svg.style.display = 'block';
      svg.style.width = '50%';
      svg.style.height = '50%';
      svg.style.margin = 'auto';
      svg.style.position = 'absolute';
      svg.style.top= '39%';
      svg.style.left= '45%';
      svg.style.zIndex= '10';
      svg.style.opacity= '100%';
    }
  });

  const plotlyFallbackTimeout = setTimeout(() => {
    if(!plotlyInitialized){
      console.warn("Plotly is Unavailable.")
      document.getElementById('myDiv').innerHTML = '<div class="un-plotly"><p>Unable to load the graphical view at the moment...</p><p> Please try again later.</p></div>';
    }
  }, 3000);

  if(typeof Plotly === 'undefined'){
    console.warn("Plotly is Unavailable.")
    document.getElementById('myDiv').innerHTML = '<div class="un-plotly"><p>Unable to load the graphical view at the moment...</p><p> Please try again later.</p></div>'
  }else{
    plotlyInitialized = true;
    clearTimeout(plotlyFallbackTimeout);
  }
})

// var resetButton = document.createElement("button");
// resetButton.id = "resetButton";
// resetButton.innerHTML = "Reset";
// document.getElementById("myDiv").insertAdjacentElement('afterend', resetButton);
function get_list_item(text_node) {
  const lstItem = document.createElement("div");
  lstItem.className = "list-item";
  lstItem.style.cursor = "default";
  lstItem.appendChild(text_node)
  return lstItem
}



function get_child_list(obj, objItem, filename) {

  const arch_name = "Arch: " + obj['arch'].toString()
  const compiler = "Compiler: " + obj['compiler'].toString()
  const deps = "Dependencies: " + obj['dependencies'].toString()
  const linker = "Linker: " + obj['linker'].toString()
  const os_name = "OS: " + obj['os_name'].toString()

  objItem.appendChild(get_list_item(document.createTextNode(("File: " + filename))))
  objItem.appendChild(get_list_item(document.createTextNode(arch_name)))
  objItem.appendChild(get_list_item(document.createTextNode(compiler)))
  objItem.appendChild(get_list_item(document.createTextNode(deps)))
  objItem.appendChild(get_list_item(document.createTextNode(linker)))
  objItem.appendChild(get_list_item(document.createTextNode(os_name)))
}

async function fill_binary_info() {
  const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
  // Show the loading SVG
  const svgElements = [
    document.getElementById('loadingSvg1'),
    document.getElementById('loadingSvg2'),
  ];
  svgElements.forEach(svg => {
    if (svg){
      svg.style.display = 'block';
      svg.style.width = '50%';
      svg.style.height = '50%';
      svg.style.margin = 'auto';
      svg.style.position = 'relative';
      svg.style.opacity= '100%';
    }
  });
  try {
    const response = await fetch("get_binary_info", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Tab-ID': tabId,
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const src_obj = data['src'];
    const tgt_obj = data['tgt'];
    const source3_html = document.getElementById('source3');
    const source4_html = document.getElementById('source4');
    source3_html.innerHTML = '';
    source4_html.innerHTML = '';
    get_child_list(src_obj, source3_html, source_filename);
    get_child_list(tgt_obj, source4_html, target_filename);
  } catch (error) {
    console.error('Error fetching binary info:', error);
  }
}


async function fill_metadata(csvContent) {
  console.log("hitting the fill_metadata")
  const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
  const svgElements = [
    document.getElementById('loadingSvg3'),
    document.getElementById('loadingSvg4'),
    document.getElementById('loadingSvg5'),
    document.getElementById('loadingSvg6')
  ];

  svgElements[0].style.top = '39%';
  svgElements[0].style.left = '35%';
  svgElements[1].style.top = '39%';
  svgElements[1].style.left = '35%';
  svgElements[2].style.top = '73%';
  svgElements[2].style.left = '35%';
  svgElements[3].style.top = '73%';
  svgElements[3].style.left = '35%';

  svgElements.forEach(svg => {
    if (svg) {
      svg.style.display = 'block';
      svg.style.position = 'absolute';
      svg.style.opacity = '100%';
    }
  });

  fill_binary_info()
  try {
    const response = await fetch("get_all_metadata", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Tab-ID': tabId,
      }
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data_1 = await response.json();
    // console.log(data);
    const jsonString = JSON.stringify(data_1);
    side_bar_content = data_1;
    console.log(side_bar_content, "inside fill_ metadata");
    localStorage.setItem("side_bar", jsonString);
    source_id = data_1['src_id'];
    target_id = data_1['tgt_id'];
    data1 = data_1[source_id];
    data2 = data_1[target_id];

    const target1_lst = document.getElementById('target1');
    const target2_lst = document.getElementById('target2');
    target1_lst.innerHTML = "";
    target2_lst.innerHTML = "";
    // console.log(data2)
    for (var key_3 in data2) {
      const lstItem = document.createElement("div");
      lstItem.className = "list-item";
      lstItem.style.cursor = "pointer";


      const svgNamespace = "http://www.w3.org/2000/svg";
      const svgElement = document.createElementNS(svgNamespace, "svg");
      svgElement.setAttribute("width", "24");
      svgElement.setAttribute("height", "24");
      svgElement.setAttribute("viewBox", "0 0 24 24");
      svgElement.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
      const polygon = document.createElementNS(svgNamespace, "polygon");
      polygon.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
      svgElement.appendChild(polygon);
      svgElement.style.width = "20px";
      svgElement.style.height = "20px";
      lstItem.appendChild(svgElement);

      const nameText = document.createTextNode(data2[key_3]['name']);
      console.log("nameText : " + nameText);
      lstItem.appendChild(nameText);

      const subList = document.createElement("div");
      subList.style.display = "none";
      subList.style.paddingLeft = "40px";
      freq_target = {};
      for (var key1 in data2[key_3]['ops_refs']) {
        if (freq_target[data2[key_3]['ops_refs'][key1]]) {
          freq_target[data2[key_3]['ops_refs'][key1]]++;
        }
        else {
          freq_target[data2[key_3]['ops_refs'][key1]] = 1;
        }
      }
      for (var key1 in freq_target) {
        const subListItem = document.createElement('div');
        subListItem.className = "sub-list-item";
        subListItem.textContent = key1 + ":" + freq_target[key1].toString();
        subList.appendChild(subListItem);
      }

      lstItem.appendChild(subList);
      target2_lst.appendChild(lstItem);
      lstItem.addEventListener('click', () => {
        svgElement.style.transform = "rotate(90deg)";
        if (subList.style.display === "none") {
          subList.style.display = "block";
        } else {
          svgElement.style.transform = "rotate(0deg)";
          subList.style.display = "none";
        }
      });




      const lstItem1 = document.createElement("div");
      lstItem1.className = "list-item";
      // lstItem1.textContent = data2[key]['name'];
      lstItem1.style.cursor = "pointer";

      const svgNamespace2 = "http://www.w3.org/2000/svg";
      const svgElement2 = document.createElementNS(svgNamespace2, "svg");
      svgElement2.setAttribute("width", "24");
      svgElement2.setAttribute("height", "24");
      svgElement2.setAttribute("viewBox", "0 0 24 24");
      svgElement2.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
      const polygon2 = document.createElementNS(svgNamespace2, "polygon");
      polygon2.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
      svgElement2.appendChild(polygon2);
      svgElement2.style.width = "20px";
      svgElement2.style.height = "20px";
      lstItem1.appendChild(svgElement2);

      const nameText2 = document.createTextNode(data2[key_3]['name']);
      lstItem1.appendChild(nameText2);

      const subList1 = document.createElement("div");
      subList1.style.display = "none";
      subList1.style.paddingLeft = "20px";
      freq_target1 = {};
      for (var key1 in data2[key_3]['string_refs']) {
        if (freq_target1[data2[key_3]['string_refs'][key1]]) {
          freq_target1[data2[key_3]['string_refs'][key1]]++;
        }
        else {
          freq_target1[data2[key_3]['string_refs'][key1]] = 1;
        }
      }
      for (var key1 in freq_target1) {
        const subListItem_1 = document.createElement('div');
        subListItem_1.className = "sub-list-item";
        subListItem_1.textContent = key1 + ":" + freq_target1[key1].toString();
        subList1.appendChild(subListItem_1);
      }
      lstItem1.appendChild(subList1);
      target1_lst.appendChild(lstItem1);

      lstItem1.addEventListener('click', () => {
        svgElement2.style.transform = "rotate(90deg)";
        if (subList1.style.display === "none") {
          subList1.style.display = "block";
        } else {
          svgElement2.style.transform = "rotate(0deg)";
          subList1.style.display = "none";
        }
      });
    }



    const source1_lst = document.getElementById('source1');
    const source2_lst = document.getElementById('source2');
    source1_lst.innerHTML = "";
    source2_lst.innerHTML = "";

    for (var key_3 in data1) {
      const lstItem_1 = document.createElement("div");
      lstItem_1.className = "list-item";
      // lstItem.textContent = data1[key]['name'];
      lstItem_1.style.cursor = "pointer";

      const svgNamespace_1 = "http://www.w3.org/2000/svg";
      const svgElement_1 = document.createElementNS(svgNamespace_1, "svg");
      svgElement_1.setAttribute("width", "24");
      svgElement_1.setAttribute("height", "24");
      svgElement_1.setAttribute("viewBox", "0 0 24 24");
      svgElement_1.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
      const polygon_1 = document.createElementNS(svgNamespace_1, "polygon");
      polygon_1.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
      svgElement_1.appendChild(polygon_1);
      svgElement_1.style.width = "20px";
      svgElement_1.style.height = "20px";
      lstItem_1.appendChild(svgElement_1);

      const nameText_1 = document.createTextNode(data1[key_3]['name']);
      lstItem_1.appendChild(nameText_1);

      const subList_1 = document.createElement("div");
      subList_1.style.display = "none";
      subList_1.style.paddingLeft = "20px";
      freq_target = {};
      for (var key1 in data1[key_3]['ops_refs']) {
        if (freq_target[data1[key_3]['ops_refs'][key1]]) {
          freq_target[data1[key_3]['ops_refs'][key1]]++;
        }
        else {
          freq_target[data1[key_3]['ops_refs'][key1]] = 1;
        }
      }
      for (var key1 in freq_target) {
        const subListItem_2 = document.createElement('div');
        subListItem_2.className = "sub-list-item";
        subListItem_2.textContent = key1 + ":" + freq_target[key1].toString();
        subList_1.appendChild(subListItem_2);
      }
      lstItem_1.appendChild(subList_1);
      source2_lst.appendChild(lstItem_1);

      lstItem_1.addEventListener('click', () => {
        svgElement_1.style.transform = "rotate(90deg)";
        if (subList_1.style.display === "none") {
          subList_1.style.display = "block";
        } else {
          svgElement_1.style.transform = "rotate(0deg)";
          subList_1.style.display = "none";
        }
      });



      const lstItem1_1 = document.createElement("div");
      lstItem1_1.className = "list-item";
      // lstItem1.textContent = data1[key]['name'];
      lstItem1_1.style.cursor = "pointer";

      const svgNamespace2_1 = "http://www.w3.org/2000/svg";
      const svgElement2_1 = document.createElementNS(svgNamespace2_1, "svg");
      svgElement2_1.setAttribute("width", "24");
      svgElement2_1.setAttribute("height", "24");
      svgElement2_1.setAttribute("viewBox", "0 0 24 24");
      svgElement2_1.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
      const polygon2_1 = document.createElementNS(svgNamespace2_1, "polygon");
      polygon2_1.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
      svgElement2_1.appendChild(polygon2_1);
      svgElement2_1.style.width = "20px";
      svgElement2_1.style.height = "20px";
      lstItem1_1.appendChild(svgElement2_1);

      const nameText2_1 = document.createTextNode(data1[key_3]['name']);
      lstItem1_1.appendChild(nameText2_1);

      const subList1_1 = document.createElement("div");
      subList1_1.style.display = "none";
      subList1_1.style.paddingLeft = "20px";

      freq_target1 = {};
      for (var key1 in data1[key_3]['string_refs']) {
        if (freq_target1[data1[key_3]['string_refs'][key1]]) {
          freq_target1[data1[key_3]['string_refs'][key1]]++;
        }
        else {
          freq_target1[data1[key_3]['string_refs'][key1]] = 1;
        }
      }
      for (var key1 in freq_target1) {
        const subListItem_3 = document.createElement('div');
        subListItem_3.className = "sub-list-item";
        subListItem_3.textContent = key1 + ":" + freq_target1[key1].toString();
        subList1_1.appendChild(subListItem_3);
      }

      lstItem1_1.appendChild(subList1_1);
      source1_lst.appendChild(lstItem1_1);

      lstItem1_1.addEventListener('click', () => {
        svgElement2_1.style.transform = "rotate(90deg)";
        if (subList1_1.style.display === "none") {
          subList1_1.style.display = "block";
        } else {
          svgElement2_1.style.transform = "rotate(0deg)";
          subList1_1.style.display = "none";
        }
      });

    }
    console.log("started second");
    init_csv_parse(csvContent);
    return;
  } catch (error) {
    console.error('Error:', error);
  }
  finally{
      svgElements.forEach(svg => {
        if (svg) {
            svg.style.display = 'none';
        }
    });
  }

}

function removeNaN(array) {
  return array.filter(function (value) {
    return !isNaN(value);
  });
}

function normalizeArray(array, min, max) {
  return array.map(function (value) {
    return (value - min) / (min - max);
  });
}

// var resetButton = document.createElement("button");
// resetButton.id = "resetButton";
// resetButton.innerHTML = "Reset";
// document.getElementById("myDiv").insertAdjacentElement('afterend', resetButton);

function init_plot() {
  var init_layout = {
    title: {
      text: 'VexIR2Vec Similarity Scatter Plot',
      font: {
        size: 24  // Increase this value to make the title text larger
      }
    },
    modebar: {
      add: [{
        name: 'Reset View',
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30"><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path></svg>'

        },
        click: function (gd) {
          reset();
        }
      }]
    }
  };


  if(plotlyInitialized){
    const svgElements = [
      document.getElementById('plotly-loadingSvg'),
    ];
    svgElements.forEach(svg => {
      if (svg){
      svg.style.display = 'block';
      svg.style.width = '50%';
      svg.style.height = '50%';
      svg.style.margin = 'auto';
      svg.style.position = 'absolute';
      svg.style.top= '39%';
      svg.style.left= '45%';
      svg.style.zIndex= '10';
      svg.style.opacity= '100%';
    }
    });
    Plotly.newPlot('myDiv', init_data, init_layout);
    document.getElementById("plotly-loadingSvg").style.display = "none";
  }else{
    document.getElementById('myDiv').innerHTML = '<div class="un-plotly"><p>Unable to load the graphical view at the moment...</p><p> Please try again later.</p></div>'
  }

  //Check if the reset button already exists

  // var resetButton = document.getElementById("resetButton");

  // if (!resetButton) {

  // Create the reset button if it doesn't exist

  // resetButton = document.createElement("button");

  // resetButton.id = "resetButton";

  // resetButton.innerHTML = "Reset";

  // document.getElementById("myDiv").insertAdjacentElement('afterbegin', resetButton);


  // Add an event listener to the reset button

  // resetButton.addEventListener("click", function () {

  // reset();

  // });

  // }



  ////////////////////////////////////
  // document.getElementById("myDiv").insertAdjacentHTML('afterend', '<button id="resetButton">Reset</button>');
  // document.getElementById("resetButton").addEventListener("click", reset);
  ///////////////////
  // console.log("plotly click from inti plot called");
document.getElementById("myDiv").on("plotly_click", function (eventData) {
    const svgElements = [
        document.getElementById('plotly-loadingSvg'),
    ];

    svgElements.forEach(svg => {
      if (svg){
        svg.style.display = 'block';
        svg.style.width = '50%';
        svg.style.height = '50%';
        svg.style.margin = 'auto';
        svg.style.position = 'absolute';
        svg.style.top = '39%';
        svg.style.left = '45%';
        svg.style.zIndex = '10';
        svg.style.opacity= '100%';
      }
    });

    const div = document.getElementById('myDiv');

    // Apply blur styles
    div.style.opacity = '0.4';  // Set opacity to 40%
    div.style.pointerEvents = 'none';  // Disable pointer events

    // Fetch data and then restore the plot
    Promise.all([
        neighbour_plot(eventData),
        selected_meta_data(eventData),
        get_neighbour_metadata(eventData)
    ]).then(() => {
        // Restore visibility once data is fetched
        svgElements.forEach(svg => {
            svg.style.display = 'none';
        });

        div.style.opacity = '1';  // Reset opacity to full visibility
        div.style.pointerEvents = 'auto';  // Re-enable pointer events
    }).catch(function (error) {
        // Handle any errors from fetchData() or subsequent handling
        console.error('Error New:', error);

        // In case of error, also restore the UI state
        svgElements.forEach(svg => {
            svg.style.display = 'none';
        });

        div.style.opacity = '1';  // Reset opacity to full visibility
        div.style.pointerEvents = 'auto';  // Re-enable pointer events
    });
});
}


function init_csv_parse(csvContent) {
  // Parse the CSV data
  // val = fill_metadata();
  var lines = csvContent.split("\n");
  var headers = lines[0].split(",");
  // console.log(headers,"headers of")
  var data = lines.slice(1).map(line => line.split(","));
  // console.log(data,"data of csv")
  var source_file = "";
  var target_file = "";
  for (const lst of data) {
    if (lst[0] !== "") {
      source_file = lst[0];
      break;
    }
  }
  for (lst in data)
    for (const lst of data) {
      if (lst[5] !== "") {
        target_file = lst[5];
        break;
      }
    }

  var x1 = removeNaN(data.map(row => parseFloat(row[2])));
  var y1 = removeNaN(data.map(row => parseFloat(row[3])));
  var z1 = removeNaN(data.map(row => parseFloat(row[4])));
  data.map(row => ls_points.push(String(row[0]) + "-" + parseInt(row[1])))
  var x2 = removeNaN(data.map(row => parseFloat(row[7])));
  var y2 = removeNaN(data.map(row => parseFloat(row[8])));
  var z2 = removeNaN(data.map(row => parseFloat(row[9])));
  data.map(row => ls_points.push(String(row[5]) + "-" + parseInt(row[6])))

  minx1 = Math.min.apply(null, x1)
  miny1 = Math.min.apply(null, y1)
  minz1 = Math.min.apply(null, z1)
  minx2 = Math.min.apply(null, x2)
  miny2 = Math.min.apply(null, y2)
  minz2 = Math.min.apply(null, z2)

  maxx1 = Math.max.apply(null, x1)
  maxy1 = Math.max.apply(null, y1)
  maxz1 = Math.max.apply(null, z1)
  maxx2 = Math.max.apply(null, x2)
  maxy2 = Math.max.apply(null, y2)
  maxz2 = Math.max.apply(null, z2)

  x1 = normalizeArray(x1, minx1, maxx1)
  y1 = normalizeArray(y1, miny1, maxy1)
  z1 = normalizeArray(z1, minz1, maxz1)

  x2 = normalizeArray(x2, minx2, maxx2)
  y2 = normalizeArray(y2, miny2, maxy2)
  z2 = normalizeArray(z2, minz2, maxz2)
  // console.log(x1)
  console.log(side_bar_content, "init_csv_parse");

  let pointdata = JSON.parse(localStorage.getItem("side_bar"));
  console.log(pointdata, "loading issue ");
  const lst_source = [];
  const lst_target = [];

  for (let item in data) {
    // console.log(data[item][0])
    if (data[item][0] && data[item][1] && pointdata[data[item][0]]) {
      // console.log(data[item][0])
      lst_source.push(pointdata[data[item][0]][data[item][1]]["name"]);
    }
    else {
      lst_source.push("NaN");
    }
    if (data[item][5] && data[item][6] && pointdata[data[item][5]]) {
      lst_target.push(pointdata[data[item][5]][data[item][6]]["name"]);
    }
    else {
      lst_target.push("NaN");
    }
  }

  var trace3 = {
    x: x1,
    y: y1,
    z: z1,
    mode: "markers",
    name: source_filename,
    text: data.map(row => String(row[0]) + "-" + parseInt(row[1])),
    // hoverinfo: 'text',
    customdata: lst_source,
    hovertemplate: '%{customdata}<extra></extra>',
    marker: {
      size: 12,
      line: {
        color: "rgba(217, 217, 217, 0.14)",
        width: 0.5
      },
      opacity: 0.8
    },
    id: 'src',
    type: "scatter3d",

  };
  console.log(trace3);
  var trace4 = {
    x: x2,
    y: y2,
    z: z2,
    mode: "markers",
    name: target_filename,
    text: data.map(row => String(row[5]) + "-" + parseInt(row[6])),
    // hoverinfo: 'text',
    customdata: lst_target,
    hovertemplate: '%{customdata}<extra></extra>',
    marker: {
      color: "rgb(127, 127, 127)",
      size: 12,
      symbol: "circle",
      line: {
        color: "rgb(204, 204, 204)",
        width: 1
      },
      opacity: 0.8
    },
    id: 'tgt',
    type: "scatter3d",
  };

  init_layout = {
    // title: 'VexIR2Vec Similarity Scatter Plot',
    title: {
      text: 'VexIR2Vec Similarity Scatter Plot',
      font: {
        size: 24  // Increase this value to make the title text larger
      }
    },
    scene: {
      xaxis: { range: [-1, 0] }, // Fixed range from 0 to 1 for X axis
      yaxis: { range: [-1, 0] }, // Fixed range from 0 to 1 for Y axis
      zaxis: { range: [-1, 0] }  // Fixed range from 0 to 1 for Z axis
    },

    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // updatemenus: [{
    //   type: 'buttons',
    //   buttons: [{
    //     label: 'Reset',
    //     method: function() {
    //       reset(); // Call the reset function directly
    //     }
    //   }]
    // }]
  };

  init_data = [trace3, trace4];

  init_plot();
}
// get the side bar content
console.log("program started first")
//TO fetch init csv
const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
fetch(`view1?text=${encodeURIComponent('init')}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Tab-ID': tabId,
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(side_bar_content, "second");
    if (data.status === 'success') {
      // console.log('Text attribute sent successfully:', data.param_received);
      // Assuming the modified CSV data is returned in the response
      var csvBase64 = data.csv_base64;
      csvContent = atob(csvBase64);
      fill_metadata(csvContent);

    } else {
      console.error('Error sending text attribute:', data.message);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });



var csvContent = null;
async function neighbour_plot(eventData) {
  const point = eventData.points[0];
  const text = point.text;  // Get the text attribute of the clicked point
  console.log(text, "neighbour data")

  if (point.data.id === 'tgt') {
    min = [minx1, miny1, minz1]
    max = [maxx1, maxy1, maxz1]
  }
  else {
    min = [minx2, miny2, minz2]
    max = [maxx2, maxy2, maxz2]
  }

  // Send the text attribute back to Django using AJAX (GET request)
  const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
  return fetch(`view1?text=${encodeURIComponent(text)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Tab-ID': tabId,
    }
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error('Got 500 buddy good luck');
      }
      else {
        return response.json()
      }

    })
    .then(data => {
      if (data.status === 'success') {
        // console.log('Text attribute sent successfully:', data.param_received);
        // Assuming the modified CSV data is returned in the response
        var csvBase64 = data.csv_base64;
        csvContent = atob(csvBase64);
        replotData(eventData, min, max);
      } else {
        console.error('Error sending text attribute:', data.message);
      }
    })
    .catch(function (error) {
      // console.log("Not ok")
      console.error('Error:', error);
      return
    });
}

function replotData(eventData, min, max) {
  // Parse the CSV data
  console.log(eventData.points[0])
  const point = eventData.points[0];
  var lines = csvContent.split("\n");
  var headers = lines[0].split(",");
  var data = lines.slice(1).map(line => line.split(","));

  // Extract columns from the data
  var x1 = normalizeArray(data.map(row => parseFloat(row[2])), min[0], max[0]);
  var y1 = normalizeArray(data.map(row => parseFloat(row[3])), min[1], max[1]);
  var z1 = normalizeArray(data.map(row => parseFloat(row[4])), min[2], max[2]);

  var plotElement = document.getElementById("myDiv");
  var scene = plotElement._fullLayout.scene;

  var xAxisRange = scene.xaxis.range;
  var yAxisRange = scene.yaxis.range;
  var zAxisRange = scene.zaxis.range;


  // // Create Plotly traces with individual text for each point
  // const text1 = point.text;
  // let arr = text1.split("-")
  // data_selected=side_bar_content[arr[0]][arr[1]]["name"]

  const text1 = point.text;
  let arr = text1.split("-")
  data_selected = side_bar_content[arr[0]][arr[1]]["name"]



  var s_file = null;
  var t_file = null;
  total_data = JSON.parse(localStorage.getItem("side_bar"));
  console.log(total_data);
  if (total_data["src_id"] == arr[0]) {
    s_file = source_filename;
    t_file = target_filename;
  }
  else {
    s_file = target_filename;
    t_file = source_filename;
  }

  var selected_func = {
    x: [point.x],
    y: [point.y],
    z: [point.z],
    name: s_file,
    text: point.text,
    hovertemplate: `${data_selected}`,
    mode: "markers",
    marker: {
      color: "rgb(0, 127, 0)", // Change color to red
      size: 12,
      line: {
        color: "rgba(150,150,100, 0.14)",
        width: 0.5
      },
      opacity: 0.8
    },
    type: "scatter3d"
  }
  console.log(data);
  var lst = [];
  for (let item in data) {
    if (data[item][0] && data[item][1]) {
      lst.push(side_bar_content[data[item][0]][data[item][1]]["name"])
    }
    else {
      lst.push("Nan")
    }
    console.log(item)
  }
  console.log(lst)
  var neighbours = {
    x: x1,
    y: y1,
    z: z1,
    name: t_file,
    mode: "markers",
    text: data.map(row => String(row[0]) + "-" + parseInt(row[1])),
    customdata: lst,
    hovertemplate: '%{customdata}<extra></extra>',
    marker: {
      color: "rgb(255, 0, 0)", // Change color to red
      size: 12,
      line: {
        color: "rgba(150,150,100, 0.14)",
        width: 0.5
      },
      opacity: 0.8
    },
    type: "scatter3d"
  }

  console.log(neighbours);
  // Get current layout and camera settings
  var currentLayout = document.getElementById("myDiv").layout;
  var camera = currentLayout.scene.camera;

  // Construct updated layout
  var updatedLayout = {
    title: {
      text: 'VexIR2Vec Similarity Scatter Plot',
      font: {
        size: 24  // Increase this value to make the title text larger
      }
    },
    scene: {
      camera: camera,
      xaxis: { range: [-1, 0] }, // Fixed range from 0 to 1 for X axis
      yaxis: { range: [-1, 0] }, // Fixed range from 0 to 1 for Y axis
      zaxis: { range: [-1, 0] }  // Fixed range from 0 to 1 for Z axis
    },
    modebar: {

      add: [{
        name: 'Reset View',
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30"><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"></path></svg>'

        },
        click: function (gd) {
          reset();
        }
      }]
    }

    // updatemenus: [{
    //   type: 'buttons',
    //   buttons: [{
    //     label: 'Reset',
    //     method: function() {
    //       reset(); // Call the reset function directly
    //     }
    //   }]
    // }]
  };


  var updatedData = [selected_func, neighbours];
  // resetButton.addEventListener("click", reset);

  if(plotlyInitialized){
    const svgElements = [
      document.getElementById('plotly-loadingSvg'),
    ];
    svgElements.forEach(svg => {
      if (svg){
        svg.style.display = 'block';
        svg.style.width = '50%';
        svg.style.height = '50%';
        svg.style.margin = 'auto';
        svg.style.position = 'absolute';
        svg.style.top= '39%';
        svg.style.left= '45%';
        svg.style.zIndex= '10';
        svg.style.opacity= '100%';
      }
    });
    Plotly.newPlot('myDiv', updatedData, updatedLayout);
    document.getElementById("plotly-loadingSvg").style.display = "none";
  }else{
    document.getElementById("myDiv").innerHTML = '<div class="un-plotly"><p>Unable to load the graphical view at the moment...</p><p> Please try again later.</p></div>'
  }


  document.getElementById("myDiv").on("plotly_click", function (eventData) {
    const svgElements = [
      document.getElementById('plotly-loadingSvg'),
    ];
    svgElements.forEach(svg => {
      if (svg){
        svg.style.display = 'block';
        svg.style.width = '50%';
        svg.style.height = '50%';
        svg.style.margin = 'auto';
        svg.style.position = 'absolute';
        svg.style.top= '39%';
        svg.style.left= '45%';
        svg.style.zIndex= '10';
        svg.style.opacity= '100%';
      }
    });
    // console.log("Selected_func: "+ selected_func.text)
    // console.log(eventData)
    // console.log(point.text)
    if (eventData.points[0].data.text === selected_func.text) {
      // console.log("hello")
      return
    }
    else {
      document.getElementById("plotly-loadingSvg").style.display = "none";
      document.getElementById('irSourceText').innerHTML = "Loading your content..."
      document.getElementById('asmSourceText').innerHTML = "Loading your content...";
      document.getElementById('sourceSourceText').innerHTML = "Loading your content..."
      document.getElementById('irTargetText').innerHTML = "Loading your content..."
      document.getElementById('asmTargetText').innerHTML = "Loading your content...";
      document.getElementById('sourceTargetText').innerHTML = "Loading your content..."

      compareDialog(eventData, selected_func);
      selected_meta_data(eventData);
    }

  });
  // Plotly.react('myDiv', updatedData, updatedLayout);

}


function compareDialog(eventData, selected_func) {
  const point = eventData.points[0];
  const curveNumber = point.curveNumber;
  // Show Dialogue
  // console.log("printing tgt_id from compareDialog" + point.text)
  showDialog(point.text, selected_func);
}

function showDialog(tgt_fid, src_fid) {
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";

  // console.log("Printing fid from showDialog" + tgt_fid);

  // Display the initial content for Choice 1 by default
  fetchContent(tgt_fid, src_fid.text);

  document.querySelector(".close").addEventListener("click", function () {
    document.getElementById("dialog").style.display = "none";
    replotData(src_fid);
  });
}
function fetchContent(tgt_fid, src_fid) {
  // console.log("fetch content is called target",tgt_fid);
  // console.log("fetch content is called source",src_fid);
  const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
  fetch(`get_point_code?text=${encodeURIComponent(tgt_fid)}`, {
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
    .then(data => {
      if (data.status === 'success') {
        // console.log('Text attribute sent successfully:', data.param_received);
        // Assuming the modified CSV data is returned in the response
        var asm_code = data.asm;
        var vexir_code = data.vexir;
        var source_code = data.source;
        document.getElementById('asmTargetText').innerHTML = hljs.highlight(
          asm_code,
          { language: 'x86asm' }
        ).value;
        document.getElementById('irTargetText').innerHTML = hljs.highlight(vexir_code, { language: 'x86asm' }).value;;
        // hljs.highlight(vexir_code,{ language: 'x86asm' }).value;
        document.getElementById('sourceTargetText').innerHTML = hljs.highlight(
          source_code,
          { language: 'C' }
        ).value;

      } else {
        console.error('Error sending text attribute:', data.message); x
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

  fetch(`get_point_code?text=${encodeURIComponent(src_fid)}`, {
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
    .then(data => {
      if (data.status === 'success') {
        // console.log('Text attribute sent successfully:', data.param_received);
        // Assuming the modified CSV data is returned in the response
        var asm_code = data.asm;
        var vexir_code = data.vexir;
        var source_code = data.source;

        document.getElementById('asmSourceText').innerHTML = hljs.highlight(
          asm_code,
          { language: 'x86asm' }
        ).value;
        document.getElementById('irSourceText').innerHTML = hljs.highlight(
          vexir_code,
          { language: 'x86asm' }
        ).value;

        document.getElementById('sourceSourceText').innerHTML = hljs.highlight(
          source_code,
          { language: 'C' }
        ).value;
      } else {
        console.error('Error sending text attribute:', data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });

  displayContent(1);

}

function displayContent(choice) {

  if (choice === 1) { //IR
    // console.log(document.getElementById('irTargetText').innerText);
    document.getElementById('irContent').style.display = "inline";
    document.getElementById('sourceContent').style.display = "none";
    document.getElementById('asmContent').style.display = "none"

  }
  if (choice === 2) { //Source Code
    // console.log(document.getElementById('irTargetText').innerText);
    document.getElementById('irContent').style.display = "none";
    document.getElementById('sourceContent').style.display = "inline";
    document.getElementById('asmContent').style.display = "none"

  }
  if (choice === 3) {
    // console.log(document.getElementById('asmTargetText').innerText);
    document.getElementById('irContent').style.display = "none";
    document.getElementById('sourceContent').style.display = "none";
    document.getElementById('asmContent').style.display = "inline"

  }
}

function view2_redirect() {

  // localStorage.setItem("points",ls_points);
  // console.log("view 1 saved points : "+ ls_points);
  window.location.href = "{% url 'view2' %}";
}





function selected_meta_data(eventData) {
  const point = eventData.points[0]
  const text = point.text;
  // console.log(text,"pranay");
  let array = text.split("-")
  file_id = array[0];
  func_id = array[1];
  if (file_id == side_bar_content['src_id']) {

    const source1_lst = document.getElementById('source1');
    source1_lst.innerHTML = ""
    const source2_lst = document.getElementById('source2');
    source2_lst.innerHTML = ""
    data1 = side_bar_content[file_id];
    console.log(file_id, func_id, data1[func_id], "left string clicked");


    // for (var key1 in data1[func_id]['ops_refs']) {
    //   const lstItem = document.createElement('div');
    //   lstItem.className = "list-item";
    //   let result = data1[func_id]['name'].concat(": ", data1[func_id]['ops_refs'][key1]);
    //   lstItem.textContent = result;
    //   source2_lst.appendChild(lstItem);
    // }
    // for (var key1 in data1[func_id]['string_refs']) {
    //   const lstItem = document.createElement('div');
    //   lstItem.className = "list-item";
    //   let result = data1[func_id]["name"].concat(": ", data1[func_id]['string_refs'][key1]);
    //   lstItem.textContent = result;
    //   source1_lst.appendChild(lstItem);
    // }

    let opsRefCount = {};
    let stringRefCount = {};

    for (var key1 in data1[func_id]['ops_refs']) {
      let result = data1[func_id]['ops_refs'][key1];
      if (opsRefCount[result]) {
        opsRefCount[result]++;
      } else {
        opsRefCount[result] = 1;
      }
    }

    for (var key1 in data1[func_id]['string_refs']) {
      let result = data1[func_id]['string_refs'][key1];
      if (stringRefCount[result]) {
        stringRefCount[result]++;
      } else {
        stringRefCount[result] = 1;
      }
    }

    for (let key in opsRefCount) {
      const lstItem = document.createElement('div');
      lstItem.className = "list-item";
      lstItem.textContent = `${key} (${opsRefCount[key]})`;
      source2_lst.appendChild(lstItem);
    }

    for (let key in stringRefCount) {
      const lstItem = document.createElement('div');
      lstItem.className = "list-item";
      lstItem.textContent = `${key} (${stringRefCount[key]})`;
      source1_lst.appendChild(lstItem);
    }
  }
  else {
    // console.log("right_side pranay")

    const target1_lst = document.getElementById('target1');
    target1_lst.innerHTML = ""
    const target2_lst = document.getElementById('target2');
    target2_lst.innerHTML = ""
    data1 = side_bar_content[file_id];
    // console.log(data1,"pranay 111 printing")


    // for (var key1 in data1[func_id]['ops_refs']) {
    //   const lstItem = document.createElement('div');
    //   lstItem.className = "list-item";
    //   let result = data1[func_id]['name'].concat(": ", data1[func_id]['ops_refs'][key1],)
    //   lstItem.textContent = result;
    //   target2_lst.appendChild(lstItem);
    // }
    // // console.log(data1[func_id]['ops_refs'],"length of string_refs");
    // for (var key1 in data1[func_id]['string_refs']) {
    //   const lstItem = document.createElement('div');
    //   lstItem.className = "list-item";
    //   let result = data1[func_id]["name"].concat(": ", data1[func_id]['string_refs'][key1])
    //   lstItem.textContent = result;
    //   target1_lst.appendChild(lstItem);
    // }

    let opsRefCount = {};
    let stringRefCount = {};

    for (var key1 in data1[func_id]['ops_refs']) {
      let result = data1[func_id]['ops_refs'][key1];
      if (opsRefCount[result]) {
        opsRefCount[result]++;
      } else {
        opsRefCount[result] = 1;
      }
    }

    for (var key1 in data1[func_id]['string_refs']) {
      let result = data1[func_id]['string_refs'][key1];
      if (stringRefCount[result]) {
        stringRefCount[result]++;
      } else {
        stringRefCount[result] = 1;
      }
    }

    for (let key in opsRefCount) {
      const lstItem = document.createElement('div');
      lstItem.className = "list-item";
      let result = `${key} (${opsRefCount[key]})`;
      lstItem.textContent = result;
      target2_lst.appendChild(lstItem);
    }

    for (let key in stringRefCount) {
      const lstItem = document.createElement('div');
      lstItem.className = "list-item";
      let result = `${key} (${stringRefCount[key]})`;
      lstItem.textContent = result;
      target1_lst.appendChild(lstItem);
    }

  }


}


// to store meta data of neighbour
function get_neighbour_metadata(eventData) {
  // console.log("get _ neighbour function execution");
  const point = eventData.points[0]
  const text = point.text;
  let array = text.split("-")
  const tabId = sessionStorage.getItem('tabId') || 'default-tab-id';
  fetch(`get_neighbour_metadata?text=${encodeURIComponent(text)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Tab-ID': tabId,
    }
  })
    .then(response => response.json())
    .then(data => {
      // console.log(data,"pranay",text);
      if (side_bar_content["src_id"] == array[0]) {
        let file_id = side_bar_content["tgt_id"]
        const target1_lst = document.getElementById('target1');
        target1_lst.innerHTML = ""
        const target2_lst = document.getElementById('target2');
        target2_lst.innerHTML = ""

        for (var key in data[file_id]) {
          const lstItem = document.createElement("div");
          lstItem.className = "list-item";
          // lstItem.textContent = data[file_id][key]["name"];
          lstItem.style.cursor = "pointer";

          const svgNamespace = "http://www.w3.org/2000/svg";
          const svgElement = document.createElementNS(svgNamespace, "svg");
          svgElement.setAttribute("width", "24");
          svgElement.setAttribute("height", "24");
          svgElement.setAttribute("viewBox", "0 0 24 24");
          svgElement.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
          const polygon = document.createElementNS(svgNamespace, "polygon");
          polygon.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
          svgElement.appendChild(polygon);
          svgElement.style.width = "20px";
          svgElement.style.height = "20px";
          lstItem.appendChild(svgElement);

          const nameText5 = document.createTextNode(data[file_id][key]["name"]);
          lstItem.appendChild(nameText5);

          const subList = document.createElement("div");
          subList.style.display = "none";
          subList.style.paddingLeft = "20px";


          freq_target1 = {}
          for (var key1 in data[file_id][key]['ops_refs']) {
            if (freq_target1[data[file_id][key]['ops_refs'][key1]]) {
              freq_target1[data[file_id][key]['ops_refs'][key1]]++;
            }
            else {
              freq_target1[data[file_id][key]['ops_refs'][key1]] = 1;
            }
          }
          for (var key1 in freq_target1) {
            const subListItem = document.createElement('div');
            subListItem.className = "sub-list-item";
            subListItem.textContent = key1 + ":" + freq_target1[key1].toString();
            subList.appendChild(subListItem);
          }
          // for (var key1 in data[file_id][key]['ops_refs']) {
          //   const subListItem = document.createElement('div');
          //   subListItem.className = "sub-list-item";
          //   subListItem.textContent = data[file_id][key]['ops_refs'][key1];
          //   subList.appendChild(subListItem);
          // }
          lstItem.appendChild(subList);
          target2_lst.appendChild(lstItem);

          lstItem.addEventListener('click', () => {
            svgElement.style.transform = "rotate(90deg)";
            if (subList.style.display === "none") {
              subList.style.display = "block";
            } else {
              svgElement.style.transform = "rotate(0deg)";
              subList.style.display = "none";
            }
          });

          // console.log("operations  filtered");
          const lstItem1 = document.createElement("div");
          lstItem1.className = "list-item";
          // lstItem1.textContent = data[file_id][key]['name'];
          lstItem1.style.cursor = "pointer";

          const svgNamespace2 = "http://www.w3.org/2000/svg";
          const svgElement2 = document.createElementNS(svgNamespace2, "svg");
          svgElement2.setAttribute("width", "24");
          svgElement2.setAttribute("height", "24");
          svgElement2.setAttribute("viewBox", "0 0 24 24");
          svgElement2.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
          const polygon2 = document.createElementNS(svgNamespace2, "polygon");
          polygon2.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
          svgElement2.appendChild(polygon2);
          svgElement2.style.width = "20px";
          svgElement2.style.height = "20px";
          lstItem1.appendChild(svgElement2);

          const nameText6 = document.createTextNode(data[file_id][key]["name"]);
          lstItem1.appendChild(nameText6);

          const subList1 = document.createElement("div");
          subList1.style.display = "none";
          subList1.style.paddingLeft = "20px";


          freq_target1 = {}
          for (var key1 in data[file_id][key]['string_refs']) {
            if (freq_target1[data[file_id][key]['string_refs'][key1]]) {
              freq_target1[data[file_id][key]['string_refs'][key1]]++;
            }
            else {
              freq_target1[data[file_id][key]['string_refs'][key1]] = 1;
            }
          }
          for (var key1 in freq_target1) {
            const subListItem = document.createElement('div');
            subListItem.className = "sub-list-item";
            subListItem.textContent = key1 + ":" + freq_target1[key1].toString();
            subList1.appendChild(subListItem);
          }
          // for (var key1 in data[file_id][key]['string_refs']) {
          //   const subListItem = document.createElement('div');
          //   subListItem.className = "sub-list-item";
          //   subListItem.textContent = data[file_id][key]['string_refs'][key1];
          //   subList1.appendChild(subListItem);
          // }

          lstItem1.appendChild(subList1);
          target1_lst.appendChild(lstItem1);

          lstItem1.addEventListener('click', () => {
            if (subList1.style.display === "none") {
              svgElement2.style.transform = "rotate(90deg)";
              subList1.style.display = "block";
            } else {
              svgElement2.style.transform = "rotate(0deg)";
              subList1.style.display = "none";
            }
          });

          // console.log("strings filtered");
        }
      }
      else {
        let file_id = side_bar_content["src_id"];
        const source1_lst = document.getElementById('source1');
        source1_lst.innerHTML = ""
        const source2_lst = document.getElementById('source2');
        source2_lst.innerHTML = ""
        for (var key in data[file_id]) {
          const lstItem = document.createElement("div");
          lstItem.className = "list-item";
          // lstItem.textContent = data[file_id][key]["name"];
          lstItem.style.cursor = "pointer";

          const svgNamespace = "http://www.w3.org/2000/svg";
          const svgElement = document.createElementNS(svgNamespace, "svg");
          svgElement.setAttribute("width", "24");
          svgElement.setAttribute("height", "24");
          svgElement.setAttribute("viewBox", "0 0 24 24");
          svgElement.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
          const polygon = document.createElementNS(svgNamespace, "polygon");
          polygon.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
          svgElement.appendChild(polygon);
          svgElement.style.width = "20px";
          svgElement.style.height = "20px";
          lstItem.appendChild(svgElement);

          const nameText7 = document.createTextNode(data[file_id][key]["name"]);
          lstItem.appendChild(nameText7);

          const subList = document.createElement("div");
          subList.style.display = "none";
          subList.style.paddingLeft = "20px";
          freq_target1 = {}
          for (var key1 in data[file_id][key]['ops_refs']) {
            if (freq_target1[data[file_id][key]['ops_refs'][key1]]) {
              freq_target1[data[file_id][key]['ops_refs'][key1]]++;
            }
            else {
              freq_target1[data[file_id][key]['ops_refs'][key1]] = 1;
            }
          }
          for (var key1 in freq_target1) {
            const subListItem = document.createElement('div');
            subListItem.className = "sub-list-item";
            subListItem.textContent = key1 + ": " + freq_target1[key1].toString();
            subList.appendChild(subListItem);
          }
          // for (var key1 in data[file_id][key]['ops_refs']) {
          //   const subListItem = document.createElement('div');
          //   subListItem.className = "sub-list-item";
          //   subListItem.textContent = data[file_id][key]['ops_refs'][key1];
          //   subList.appendChild(subListItem);
          // }
          lstItem.appendChild(subList);
          source2_lst.appendChild(lstItem);

          lstItem.addEventListener('click', () => {
            svgElement.style.transform = "rotate(90deg)";
            if (subList.style.display === "none") {
              subList.style.display = "block";
            } else {
              subList.style.display = "none";
            }
          });

          // console.log("operations  filtered");
          const lstItem1 = document.createElement("div");
          lstItem1.className = "list-item";
          // lstItem1.textContent = data[file_id][key]['name'];
          lstItem1.style.cursor = "pointer";

          const svgNamespace2 = "http://www.w3.org/2000/svg";
          const svgElement2 = document.createElementNS(svgNamespace2, "svg");
          svgElement2.setAttribute("width", "24");
          svgElement2.setAttribute("height", "24");
          svgElement2.setAttribute("viewBox", "0 0 24 24");
          svgElement2.style.marginRight = "10px"; // Optional: Add margin to the right of the SVG
          const polygon2 = document.createElementNS(svgNamespace2, "polygon");
          polygon2.setAttribute("points", "7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707");
          svgElement2.appendChild(polygon2);
          svgElement2.style.width = "20px";
          svgElement2.style.height = "20px";
          lstItem1.appendChild(svgElement2);

          const nameText8 = document.createTextNode(data[file_id][key]["name"]);
          lstItem1.appendChild(nameText8);

          const subList1 = document.createElement("div");
          subList1.style.display = "none";
          subList1.style.paddingLeft = "20px";

          freq_target1 = {}
          for (var key1 in data[file_id][key]['string_refs']) {
            if (freq_target1[data[file_id][key]['string_refs'][key1]]) {
              freq_target1[data[file_id][key]['string_refs'][key1]]++;
            }
            else {
              freq_target1[data[file_id][key]['string_refs'][key1]] = 1;
            }
          }
          for (var key1 in freq_target1) {
            const subListItem = document.createElement('div');
            subListItem.className = "sub-list-item";
            subListItem.textContent = key1 + ":" + freq_target1[key1].toString();
            subList1.appendChild(subListItem);
          }
          // for (var key1 in data[file_id][key]['string_refs']) {
          //   const subListItem = document.createElement('div');
          //   subListItem.className = "sub-list-item";
          //   subListItem.textContent = data[file_id][key]['string_refs'][key1];
          //   subList1.appendChild(subListItem);
          // }

          lstItem1.appendChild(subList1);
          source1_lst.appendChild(lstItem1);

          lstItem1.addEventListener('click', () => {
            svgElement2.style.transform = "rotate(90deg)";
            if (subList1.style.display === "none") {
              subList1.style.display = "block";
            } else {
              svgElement2.style.transform = "rotate(0deg)";
              subList1.style.display = "none";
            }
          });


        }
      }
      // console.log("ended");
    })
    .catch(error => {
      if (side_bar_content["src_id"] == array[0]) {
        const target1_lst = document.getElementById('target1');
        target1_lst.innerHTML = "Does Not Have Neighbouring Points"
        const target2_lst = document.getElementById('target2');
        target2_lst.innerHTML = "Does Not Have Neighbouring Points"
      }
      else {
        const source1_lst = document.getElementById('source1');
        source1_lst.innerHTML = "Does Not Have Neighbouring Points"
        const source2_lst = document.getElementById('source2');
        source2_lst.innerHTML = "Does Not Have Neighbouring Points"
      }

      console.error('Error:', error);
    });
}

function reset() {
  document.getElementById('source1').innerHTML = '';
  document.getElementById('target1').innerHTML = '';
  document.getElementById('source2').innerHTML = '';
  document.getElementById('target2').innerHTML = '';
  fill_metadata();
  fill_binary_info()
  init_plot();


}
