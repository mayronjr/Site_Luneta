import React from 'react';

import '../CheckStyle.css';

const SelectTag = ({tags, checkedT}) =>{
    const list = tags.map(
        (item, index)=>{
            let style = "Search-Check-Box"
            if(item.checked){
                style = "Search-Check-Box Selected"
            }
            return(
                <div className={style}
                    key={item.key}
                    onClick={() => checkedT(index)}
                >{item.Nome}
                </div>
            )
        })
    return(
        <div className="Search-Check">
            {list}
        </div>
    )
}

export default SelectTag;