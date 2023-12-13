import React from 'react';

function Center(props){
    return (
        <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
           {props.children}
        </div>
    )
}

export default Center;