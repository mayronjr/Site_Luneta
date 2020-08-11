import React from 'react';

import '../CheckStyle.css';

const SelectEditores = ({list_editores, checkedE}) =>{
    const list = list_editores.map(
        (item, index)=>{
            let style = "Search-Check-Box"
            if(item.permit){
                style = "Search-Check-Box Selected"
            }
            return(
                <div
                    className={style}
                    key={index}
                    onClick={() => checkedE(index)}
                >{item.name}
                </div>
            )
        })
    return(
        <div className="Search-Check">
            {list}
        </div>
    )
}

export default SelectEditores;