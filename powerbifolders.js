waitForElementToDisplay(
    ".gridWrapper.ng-star-inserted",
    loadExtension,
    500,
    10000
);

function loadExtension() {
    var rowsOrig = document.getElementsByClassName("cdk-virtual-scroll-content-wrapper")[0].children
    var rows = document.getElementsByClassName("cdk-virtual-scroll-content-wrapper")[0].cloneNode(true).children

    for (var rowOrig of rowsOrig) {
        // Remove old item row if not folder
        if (!rowOrig.classList.contains("folderRow")) {
            rowOrig.style.display = 'none';
        }
    }

    var lastFolderName = ""
    for (var row of rows) {
        let name = row.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText
        let folderName = name.split("/")[0].trim()

        let rowElement = rows[0].cloneNode(true)
        rowElement.classList.add("folderRow")
        rowElement.classList.add("folderRow-"+folderName)
        
        // Fix icon
        rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].classList.replace("pbi-glyph-barchart", "pbi-glyph-open-folder-horizontal")
        rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].classList.replace("pbi-glyph-database", "pbi-glyph-open-folder-horizontal")
        rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].style.backgroundColor = "#fdb900"

        // Fix name and link
        rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText = folderName
        rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].href="javascript:;"
        rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].classList.add("openFolderClick")

        // Fix type
        rowElement.children[2].getElementsByTagName('span')[0].innerText = "Folder"

        //////

        if (lastFolderName == folderName) {
            continue;
        } else {
            lastFolderName = folderName
        }

        // Add folder row if not exist already
        if (row.getElementsByClassName("folderRow-"+folderName).length == 0) {
            document.getElementsByClassName("cdk-virtual-scroll-content-wrapper")[0].appendChild(rowElement)
        }

    }



    // add parent folder
    rowElement = rows[0].cloneNode(true)
    rowElement.classList.add("parentFolderRow")

    // Fix icon
    rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].classList.replace("pbi-glyph-barchart", "pbi-glyph-open-folder-horizontal")
    rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].classList.replace("pbi-glyph-database", "pbi-glyph-open-folder-horizontal")
    rowElement.children[0].getElementsByTagName('span')[0].getElementsByTagName('mat-icon')[0].style.backgroundColor = "#fdb900"

    // Fix name and link
    rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText = "<zurück>"
    rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].href="javascript:;"
    rowElement.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].classList.add("parentFolderClick")

    // Fix type
    rowElement.children[2].getElementsByTagName('span')[0].innerText = "Folder"

    // Add folder row
    document.getElementsByClassName("cdk-virtual-scroll-content-wrapper")[0].prepend(rowElement)

    for (var rowOrig of rowsOrig) {
        if (rowOrig.classList.contains("parentFolderRow")) {
            rowOrig.style.display = 'none';
        }
    }


    // Handle folder click
    var folderElems = document.getElementsByClassName("openFolderClick")
    for(var folderElem of folderElems) {
        folderElem.addEventListener("click", openFolder, false);
    }

    function openFolder() {
        var folderRows = document.getElementsByClassName('folderRow')
        for (var folderRow of folderRows) {
            folderRow.style.display = 'none'
        }

        // Unhide all rows with matching names
        var rowsOrigArray = Array.from(rowsOrig)
        for (var row1 of rowsOrigArray) {
            let rowName = row1.children[1].getElementsByTagName('span')[0].getElementsByTagName('a')[0].innerText.split("/")[0].trim()
            if (rowName == this.innerText && !row1.classList.contains("folderRow")) {
                row1.style=''
            }
        }

        // unhide parentfolderrow
        for (var rowOrig of rowsOrig) {
            if (rowOrig.classList.contains("parentFolderRow")) {
                rowOrig.style = '';
            }
        }

        // Handle parent folder click
        var folderElems1 = document.getElementsByClassName("parentFolderClick")
        for(var folderElem1 of folderElems1) {
            folderElem1.addEventListener("click", parentFolder, false);
        } 
    }

    function parentFolder() {

        // hide everything but folders
        for (var rowOrig of rowsOrig) {
            if (!rowOrig.classList.contains("folderRow")) {
                rowOrig.style.display = 'none';
            }
        }

        // unhide folders
        for (var rowOrig of rowsOrig) {
            if (rowOrig.classList.contains("folderRow")) {
                rowOrig.style = '';
            }
        }

        // Handle folder click
        var folderElems = document.getElementsByClassName("openFolderClick")
        for(var folderElem of folderElems) {
            folderElem.addEventListener("click", openFolder, false);
        }
    }
}

// Helper function
// https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
            return;
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
}