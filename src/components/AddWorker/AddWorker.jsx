import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import { InputPicker, Input, Whisper, Tooltip, TagPicker } from 'rsuite';
import ImageInput from '../ImageInput/imageInput';
import './index.css'

export default function AddWorker({handleClose}) {
    const [inputs, setInputs] = useState({
        name: '',
        surname: '',
        email: '',
        title: '',
        companies: []
    });

    const photoRef = useRef(null);

    const handleWorkerCreate = async (event) => {
        event.preventDefault();
        try{
            const formData = new FormData();
            formData.append('name', inputs.name);
            formData.append('surname', inputs.surname);
            formData.append('email', inputs.email);
            formData.append('title', inputs.title);
            formData.append('head', localStorage.getItem('id'));
            formData.append('companies', inputs.companies);
            formData.append('image', photoRef.current.getPhoto());



            await axios.post('https://memetricsserver.onrender.comapi/workers/', formData, {
                headers: {
                    "content-type": "application/json",
                    "Content-type": "multipart/form-data",
                },
            })

            handleClose();
        }catch(error){
            console.log(error);
        }
    }

    const handleInputChange = async (string, event) => {
        // console.log(event.nativeEvent.target.name)
        await setInputs({...inputs, [event.nativeEvent.target.name]: string})

        console.log(inputs)
    }

    const handleSelect = async(string) => {
        await setInputs({...inputs, ["title"]: string})
    }

    const employeeData = [
        'Developer',
        'Manager',
        'Designer',
        'Project leader'
    ].map(item => ({ label: item, value: item }));


    const handleTagSelect = async (string) => {
        await setInputs({...inputs, ["companies"]: string})
    }

    const [companies, setCompanies] = useState([]);

    useEffect(() => {
        const getCompanies = async() => {
            try{
                const url = `https://memetricsserver.onrender.comapi/companies/list`;
                const {data: res} = await axios.get(url, {params: {id: localStorage.getItem('id')}});

                let data = res.data.map(
                    item => ({
                        label: item.name,
                        value: item.id,
                    })
                );

                setCompanies(data);
            }catch(error){
                console.log(error);
            }
        }

        getCompanies()
    }, [])

    return (
        <div className='form-modal-container'>
            <form className='worker_form' onSubmit={handleWorkerCreate}>
                <div className='form-close' onClick={handleClose}></div>

                <h1>
                    Create worker
                </h1>

                <div className='worker_content'>
                    <ImageInput ref={photoRef}/>
                    <div>
                        <div className='worker_input'>
                            <Whisper placement='bottom' trigger="focus" speaker={<Tooltip>This name will be used for your employee</Tooltip>}>
                                <Input autoComplete="off" onChange={handleInputChange} name='name' value={inputs.name} style={{ width: 300 }} placeholder="Name" />
                            </Whisper>
                        </div>


                        <div className='worker_input'>
                            <Whisper placement='bottom' trigger="focus" speaker={<Tooltip>This surname will be used for your employee</Tooltip>}>
                                <Input autoComplete="off" onChange={handleInputChange} style={{ width: 300 }} name='surname' placeholder="Surname" />
                            </Whisper>
                        </div>


                        <div className='worker_input'>
                            <Whisper placement='bottom' trigger="focus" speaker={<Tooltip>We will send data to this account</Tooltip>}>
                                <Input autoComplete="off" onChange={handleInputChange} style={{ width: 300 }} name='email' type='email' placeholder="Email" />
                            </Whisper>
                        </div>

                        <div className='worker_input'>
                            <InputPicker 
                                size="md"
                                data={employeeData} 
                                style={{ width: 300 }} 
                                placeholder="Select your title"
                                onSelect={handleSelect}
                            />
                        </div>


                        <div className='worker_input'>
                            {
                                companies.length > 0 && 
                                <TagPicker
                                    data={companies}
                                    style={{ width: 300 }}
                                    menuStyle={{ width: 300 }}
                                    onChange={handleTagSelect}
                                />
                            }
                        </div>
                    </div>
                </div>
                
                <button className='worker_btn' type='submit'>Create</button>
            </form>
        </div>
    )
}
