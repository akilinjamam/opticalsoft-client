import '../../../../global_style/global_style.css'
import Pagination from '../../pagination/Pagination';
import manualSales from './ManualSales.module.scss';

import ManualSalesTable from './ManualSalesTable';
import useManualSales from './useManualSales';
import { manualSalesInput } from './manualSalesInput';
import { useDispatch} from 'react-redux';
import { openModal } from '../../../modal/imgmodal/imgModalSlice';

const ManualSales = () => {
  const {employeeData, setEmployeeData, showData, setShowData, paginatedDataContainer, setPaginatedDataContainer, paginatedIndex, setPaginatedIndex, edit, setEdit, editProduct, handleSubmit, initialEmployeeData, setUploading, uploading, handlePost, category, setCategory} = useManualSales()


  


  const dispatch = useDispatch();
    return (
        <div className={`${manualSales.main} full_width`}>
          <div  className={`flex_around`}>
            <div className={`${manualSales.inputAreaOne} flex_center`}>
              <div className={`${manualSales.container} `}>
                    <div className={`${manualSales.titleName}`}>{edit ? 'Update Employee' : 'Add Employee'}</div>
                    <div style={{width: `${edit ? '135px' : '120px'}`}}  className={`${manualSales.border_remover} `}></div>

                  <form onSubmit={handleSubmit} action="">
                  <div style={{width:'49%'}}>
                            {
                              manualSalesInput?.map((input, index) => {
                                return (
                                  <div key={index+1} className={`${manualSales.inputFields} flex_between`}>
                                    <label htmlFor="">{input.placeholder}:</label>
                                    <input value={employeeData[input.name]}   type={input.type} 
                                        onChange={(e) => {setEmployeeData({...employeeData, [input.value]: e.target.value})}}
                                      
                                    />
                                </div>
                                )
                              })
                            }

                            <div className={`${manualSales.inputFields} flex_between`}>
                                <label htmlFor="">Category:</label>
                                <select value={category} name="" id="" onChange={(e) => setCategory(e.target.value)}>
                                    <option value="">Select Category</option>
                                    <option value="Glass">Glass</option>
                                    <option value="Lense">Lense</option>
                                </select>
                            </div>

                            <div className={`${manualSales.inputFields} flex_between`}>
                            
                            </div>
                          </div>
                  
                        <div className={`${manualSales.inputAreaOne_footer} flex_right`}>
                              <div className={`${manualSales.inputAreaOne_footer_container} flex_around`}>
                                  { !edit
                                  &&
                                    <button type='submit' name='submit' className={`commonButton btnColor_orange`}>ADD TO LIST</button>
                                  }
                                  { edit 
                                    ?
                                    <button onClick={editProduct} className={`commonButton btnColor_green`}>SAVE</button>
                                    :
                                  <button onClick={(e) => {
                                    e.preventDefault()
                                    handlePost()
                                  }} className={`commonButton btnColor_green`}>ADD TO SALE</button>
                                  }
                                  {
                                    edit
                                    ? 
                                    <button onClick={(e) => {
                                      e.preventDefault()
                                      setEdit('')
                                    
                                      setEmployeeData(initialEmployeeData)
                                    } } className={`commonButton btnColor_red`}>CANCEL</button>
                                    :
                                    <button onClick={(e) => {
                                      e.preventDefault();
                                      setShowData([]);
                                      setEmployeeData(initialEmployeeData)
                                     setCategory('')
                                      setUploading(false)
                                    }} className={`commonButton btnColor_orangeRed`}>
                                      RESET
                                      </button>
                                  }
                                 
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(openModal('customer'))} 
                                    }
                                   style={{border:'none', width:'auto', padding:'3px 7px', borderRadius:"5px", color:'white', fontWeight:'bold', backgroundColor:'gray', cursor:'pointer',}} >
                                      ADD CUSTOMER INFO
                                    </button>
                                  <button
                                  onClick={(e) => {
                                    e.preventDefault()
                                    dispatch(openModal('invoice'))
                                  }}
                                  style={{border:'none', width:'auto', padding:'3px 7px', borderRadius:"5px", color:'white', fontWeight:'bold', backgroundColor:'gray', cursor:'pointer'}} >
                                      PRINT INVOICE
                                    </button>
                                  
                              </div>
                        </div>
                  </form>
              </div>
            </div>
            <div className={`${manualSales.inputAreaTwo} flex_center`}>
              <div className={`${manualSales.container} `}>
                    <div className={`${manualSales.titleName} flex_center`}></div>
                    <div style={{width: ''}} className={`${manualSales.border_remover}`}></div>
                        <div className={`${manualSales.inputAreaTwoContainer}`}>
                         
                              

                              <div className={`${manualSales.uploading}`}>
                                  {uploading ? 'uploading...' : ''}
                              </div>
                              
                        </div>

              </div>
            </div>
          </div> 
            <ManualSalesTable setShowData={setShowData} showData={showData} paginatedDataContainer={paginatedDataContainer} paginatedIndex={paginatedIndex} setEdit={setEdit} edit={edit}/>
            <Pagination showData={showData} setPaginatedDataContainer={setPaginatedDataContainer} setPaginatedIndex={setPaginatedIndex}/>
        </div>
    );
};

export default ManualSales; 