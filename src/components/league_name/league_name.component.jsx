import React, { useState, useEffect } from 'react';

const LeagueName = ({ items, checkedItems, onCheckChange,onAllCheckedChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState(items);
  const isAllChecked = filteredItems.length > 0 && filteredItems.every(item => checkedItems.has(item));

  useEffect(() => {
    setFilteredItems(
      items.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, items]);

  useEffect(() => {
    
    onAllCheckedChange(isAllChecked);
}, [isAllChecked, onAllCheckedChange]);

  const handleCheck = (item) => {
    const newCheckedItems = new Set(checkedItems);
    if (newCheckedItems.has(item)) {
      newCheckedItems.delete(item);
    } else {
      newCheckedItems.add(item);
    }
    onCheckChange(newCheckedItems);
  };

  const handleCheckAll = () => {
    let newCheckedItems;
    if (filteredItems.every(item => checkedItems.has(item))) {
      newCheckedItems = new Set(Array.from(checkedItems).filter(item => !filteredItems.includes(item)));
    } else {
      newCheckedItems = new Set([...checkedItems, ...filteredItems]);
    }
    onCheckChange(newCheckedItems);
  };


    return(
    <div>
        <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      {filteredItems.length > 0 ? (
        <div style={{maxHeight:'1000px',overflow:'scroll'}}>
          <div>
            <label>
              <input
                type="checkbox"
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
              Check All
            </label>
          </div>
          {filteredItems.map(item => (
            <div key={item}>
              <label>
                <input
                  type="checkbox"
                  checked={checkedItems.has(item)}
                  onChange={() => handleCheck(item)}
                />
                {item}
              </label>
            </div>
          ))}
        </div>
      ) : (
        <div>No items found</div>
      )}
        </div>
    )
}

export default LeagueName;