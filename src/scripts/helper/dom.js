/**
 * Remove all children of a given node
 *
 * @param node Node Element which children should be cleared
 */
function clearChildren(node) {
	while (node.hasChildNodes()) {
		node.removeChild(node.lastChild);
	}
}

/**
 * Populates node with data, e.g. add/extend attributes
 *
 * @param   node Node   Node to extend
 * @param   data Object Data for extension
 *
 * @returns      Node   Extended node
 */
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

/**
 * Clear content of given node and append new node after
 *
 * @param   target Node Target to be cleared and populated
 * @param   node   Node New child to be appended
 *
 * @returns        Node
 */
export function renderInNode(target, node) {
  clearChildren(target);
  target.appendChild(node);
}

/**
 * Build table row from data arrays
 *
 * @param   cells        Array
 * @param   cellNodeName String
 *
 * @returns              Node
 */
function buildTableRow(cells, cellNodeName) {
	const row = document.createElement('tr');
	const cell = document.createElement(cellNodeName);

	cells.forEach((value) => {
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
    thead.appendChild(buildTableRow(headData, 'th'));
    tableNode.appendChild(thead);
  }

  if(bodyData) {
	  const tbody = document.createElement('tbody');
    if (bodyData.length) {
      bodyData.forEach((data) => {
        tbody.appendChild(buildTableRow(data, 'td'));
      });
    }
    tableNode.appendChild(tbody);
  }

  if(footData) {
    const tfoot = document.createElement('tfoot');
    tfoot.appendChild(buildTableRow(footData, 'td'));
    tableNode.appendChild(tfoot);
  }

  return tableNode;
}

/**
 * Build list from data arrays
 *
 * @param   listNodeName String Node name of list item, e.g. ul/ol
 * @param   listItemData Array  Data for list items
 *
 * @returns              Node   List node
 */
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
