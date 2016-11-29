function clearChildren(node) {
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
}

function extendNode(node, data) {
  if (data['children']) {
    node.innerHTML = data['children'];
  }

  if (data.className) {
    data.className.forEach(
      (className) => node.classList.add(className)
    );
  }

  return node;
}

function getTableRow(cells, cellNodeName) {
	const row = document.createElement('tr');
	const cell = document.createElement(cellNodeName);

	cells.forEach(function (value) {
		const cellInstance = cell.cloneNode(false);

		row.appendChild(
      value && Object.keys(value).length ?
        extendNode(cellInstance, value) :
        cellInstance
    );
	});

	return row;
}

/**
 * Build table from data arrays
 *
 * @param   headData Array
 * @param   bodyData Array
 * @param   footData Array
 * @returns Node
 */
export function buildTable(headData, bodyData, footData) {
  const tableNode = document.createElement('table');

  if(headData) {
    const thead = document.createElement('thead');
    thead.appendChild(getTableRow(headData, 'th'));
    tableNode.appendChild(thead);
  }

  if(bodyData) {
	  const tbody = document.createElement('tbody');
    if (bodyData.length) {
      bodyData.forEach((data) => {
        tbody.appendChild(getTableRow(data, 'td'));
      });
    }
    tableNode.appendChild(tbody);
  }

  if(footData) {
    const tfoot = document.createElement('tfoot');
    tfoot.appendChild(getTableRow(footData, 'td'));
    tableNode.appendChild(tfoot);
  }

  return tableNode;
}

export function renderInNode(target, node) {
  clearChildren(target);
  target.appendChild(node);
}

export function buildList(listNodeName, listItemData) {
  const listNode = document.createElement(listNodeName);
  const listItemNode = document.createElement('li');

  listItemData.forEach((value) => {
    const listItemInstance = listItemNode.cloneNode(false);

		listNode.appendChild(
      value && Object.keys(value).length ?
        extendNode(listItemInstance, value) :
        listItemInstance
    );
  });

  return listNode;
}
