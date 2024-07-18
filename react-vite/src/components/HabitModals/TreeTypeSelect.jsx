import './TreeTypeSelect.css'
import TreeTypes from '../TreeTypes/TreeTypes';
import TypeImage from '../TreeTypes/typeImage';

function TreeTypeSelect ({treetype}) {
    // grab treetype object 
    const typeObj = TreeTypes(treetype);

    // requires
    let reqmsg = '';
    const requires = typeObj.requirements;
    if (requires == 1) reqmsg = 'Requires: 1 Habit Completion to Grow';
    else reqmsg = `Requires: ${requires} Habit Completions to Grow`; 

    // resiliance 
    let resmsg = '';
    const resiliance = typeObj.resiliance;
    if (resiliance == 1) resmsg = 'Resilience: 1 Day';
    else resmsg = `Resilience: ${resiliance} Days`;
    // resiliance description 
    let resdesc = '';
    if (resiliance == 1) resdesc = 'failing to complete habit more than once during the growth period will kill your tree.';
    else resdesc = `failing to complete habit for more than ${resiliance} days during the growth period will kill your tree.`; 

    // growth period 
    let gpmsg = '';
    const growthperiod = resiliance + requires; 
    if (growthperiod == 1) gpmsg = 'Growth Period: 1 Day';
    else gpmsg = `Growth Period: ${growthperiod} Days`;


    



    return (
        <div className='type-info'>
            <div className='type-info-top'>
                <TypeImage type={treetype}/>
                <div className='name-quote'>
                    <h1>{treetype}</h1>
                    <p>{typeObj.quote}</p>
                </div>
            </div>
            <div className='type-info-bottom'>
                <p className='typemsg'>{gpmsg}</p>
                <p className='typemsg'>{reqmsg}</p>
                <p className='typemsg' id='resmsg'>{resmsg}</p>
                <p className='desc'>{resdesc}</p>
            </div>

        </div>
    )
}

export default TreeTypeSelect;