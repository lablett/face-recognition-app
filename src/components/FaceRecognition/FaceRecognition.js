import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({ box, inputURL }) => {
    return (
        <div className='center ma'>
            <div className='absolute mt4 image'>
                <img id='input-image' src={inputURL} alt={''} />
                <div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}></div>
            </div>
        </div>
    )
}

export default FaceRecognition;