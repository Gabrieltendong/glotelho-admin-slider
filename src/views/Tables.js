import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardHeader,
    CardBody,
    FormInput,
    FormCheckbox
   } from "shards-react";
import Rodal from 'rodal';
import Loader from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';
import firebase from 'firebase'
import Switch from "react-switch";
import { withRouter } from "react-router-dom";

import 'rodal/lib/rodal.css';
import '../assets/style.css'
import 'react-toastify/dist/ReactToastify.css';
import { storage } from '../config/firebaseInit'
import PageTitle from "../components/common/PageTitle";
import { getAllCategorie } from '../api'

const db = firebase.firestore()
const sliders = db.collection('sliders')

class Tables extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isVisibleModal: false,
      isVisibleModalRemove: false,
      isLoading: false,
      isUpdate: false,
      listSlider: [],
      categorie: [],
      slider: {},
      activePage: 15,
      image: '',
      idCat: '',
      sliderImage: '',
      isActive: false
    }
    this.handleChange = this.handleChange.bind(this);
  }

  async componentDidMount(){
    this.loadData()
    const res = await getAllCategorie()
    
    this.setState({categorie: res.data.children_data})
    console.log('response', this.state.categorie)
  }

  loadData() {
    sliders.get()
    .then((res) => {
      res.forEach((snapshot) => {
        const id = snapshot.id
        const data = snapshot.data()
        const slider = {
          id,
          description: data.description,
          imageUrl: data.imageUrl,
          isActive: data.isActive
        }
        this.setState({
          listSlider: [...this.state.listSlider, slider]
        })
      })
    })
  }

  toggleModalRemove = (item) => {
    if(item){
      this.setState({
        isVisibleModalRemove: !this.state.isVisibleModalRemove,
        id: item.id
      })
    }else{
      this.setState({isVisibleModalRemove: !this.state.isVisibleModalRemove})
    }
  }

  toggleModal = (value) => {
    if(value.description){
      this.setState({
        isVisibleModal: !this.state.isVisibleModal,
        isUpdate: true,
        id: value.id,
        description: value.description,
        isActive: value.isActive,
        sliderImage: value.imageUrl
      })
    }else{
      this.setState({
        isVisibleModal: !this.state.isVisibleModal,
        isUpdate: false,
        sliderImage: ''
      })
    }
  }

  handleClick = event => {
    event.preventDefault()
    this.hiddenFileInput.click()
  };

  uploadImage = (image) => {
    return new Promise((resolve, reject) => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image)
      uploadTask.on(
        'state_changed',
        snapshot => {},
        error => {
          console.log('error', error)
          reject(error)
        },
        () => {
          storage
          .ref('images')
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            resolve(url)
            console.log('url image', url)
          })
        }
      )
    })
  }

  handleChange = (event, label) => {
    if(label == 'file'){
      const fileUploaded = event.target.files[0];
      this.setState({
        image: fileUploaded,
        sliderImage: URL.createObjectURL(fileUploaded)
      })
      console.log('URL.createObjectURL(fileUploaded',URL.createObjectURL(fileUploaded))
    }
    else if(label == 'is_active'){
      this.setState({isActive: !this.state.isActive})
    }
    else if(label == 'description'){
      this.setState({description: event.target.value})
    }
  };

  toastSucces(message) {
    toast.success(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  createSilder = async (e) => {
    e.preventDefault()
    this.setState({isLoading: true})
    const url = await this.uploadImage(this.state.image)
    if(url) {
      const data = {
        description: this.state.description,
        isActive: this.state.isActive,
        imageUrl: url
      }
      sliders.add(data)
      .then((res) => {
        this.setState({
          listSlider: [...this.state.listSlider, data],
          isLoading: false,
          isVisibleModal: false
        })
        this.toastSucces('Slider créer avec succès')
      })

    }
    // console.log('response', resp)
  }

  updateSlider = async (e) => {
    e.preventDefault()
    this.setState({isLoading: true})
    const { id, description, isActive, sliderImage, image } = this.state
    let data = {description, isActive}
    if(image){
      const url = await this.uploadImage(this.state.image)
      data.imageUrl = url
      sliders.doc(id)
      .set(data)
      .then((res) => {
        this.setState({
          isLoading: false,
          isVisibleModal: false
        })
        this.toastSucces('Slider modifié avec succès')
      })
    }else{
      data.imageUrl = sliderImage;
      sliders.doc(id)
      .set(data)
      .then((res) => {
        this.setState({
          isLoading: false,
          isVisibleModal: false
        })
        this.toastSucces('Slider modifié avec succès')
      })
    }
  }

  deleteSilder = (e) => {
    e.preventDefault()
    sliders.doc(this.state.id)
    .delete()
    .then((res) => {
      this.setState({
        isVisibleModalRemove: false,
        listSlider: this.state.listSlider.filter((item) => item.id != this.state.id)
      })
      this.toastSucces('Slider supprimé avec succès')
    })
  }

  handlePageChange(pageNumber) {
    console.log(`active page is ${pageNumber}`);
    this.setState({activePage: pageNumber});
  }

  render() {
    const { isVisibleModal, isLoading, isUpdate, isVisibleModalRemove } = this.state
    console.log('update', isUpdate)
    return(
      <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Créer un slide" className="text-sm-left" />
        <Col className="col-lg offset-7 mb-4">
          <button className = 'btn btn-primary' onClick = {this.toggleModal}>Créer</button>
        </Col>
      </Row>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        {/* Same as */}
      <ToastContainer />
      <Rodal
        width = {400}
        height = {200}
        visible={isVisibleModalRemove}
        onClose={this.toggleModalRemove}
      >
        <h4>Supprimer</h4>
        <p>Voulez vous vraiment suppimer ce Slider?</p>
        <div className = "d-flex justify-content-center">
            <button onClick = {this.toggleModalRemove} className = "btn btn-danger mr-3">Non</button>
            <button onClick = {this.deleteSilder} className = "btn btn-success">Oui</button>
        </div>
      </Rodal>
      {/* ------------------ update and reacte slider -------------------------- */}
      <Rodal
        width = {530}
        height = {550}
        visible={isVisibleModal}
        onClose={this.toggleModal}
      >
        <div>
          {
            !isUpdate?
            <h2>Créer un slider</h2>
            :
            <h2>Modifier</h2>
          }
        </div>
        {
          isLoading?
          <div className = 'spinnerContent'>
            <Loader
              type="Circles"
              color="#c79e45"
              height={50}
              width={50}
            />
          </div>:null
        }
        <div>
          <form className="md-form content-form" >
          <div className="md-form mb-3">
            <label htmlFor="materialLoginFormEmail">Description</label>
            <input type="email" value = {!isUpdate?'':this.state.description} onChange = {(e) => this.handleChange(e, 'description')} id="materialLoginFormEmail" className="form-control" />
          </div>

          <Row>
            <Col className="col-lg d-flex justify-content-center">
            {
              !this.state.sliderImage && !isUpdate?
              <div onClick={this.handleClick} className = 'btn_upload'>
                <i className="material-icons mr-1">cloud_upload</i>Upload a file
              </div>
              :
              <img onClick={this.handleClick} src = {this.state.sliderImage} className  = 'sliderImage'/>
            }
            <FormInput
              type = 'file'
              onChange = {(e) => this.handleChange(e, 'file')}
              hidden
              innerRef={(ref) => this.hiddenFileInput = ref}
            />
            </Col>
          </Row>
          <Row>
          <div className="form-group ml-3 mt-3">
            <label htmlFor="exampleFormControlSelect2">choisir la categorie du slider</label>
            <select onChange = {(e) => console.log('selected cat', e.target.value)} value = {this.state.idCat} className="form-control" id="exampleFormControlSelect2">
              {
                this.state.categorie.length != 0 && this.state.categorie.map((item) => (
                  <option value = {item.id}>{item.name}</option>
                ))
              }
            </select>
          </div>
          </Row>
          <Row>
            <FormCheckbox
            className = 'ml-3 mt-2'
              checked={!isUpdate?false:this.state.isActive}
              onChange={e => this.handleChange(e, "is_active")}
            >
              Is active
            </FormCheckbox>
          </Row>
          {/* <input type="file"
              ref={(ref) => this.hiddenFileInput = ref}
              accept = "image/*"
              onChange = {(value) => console.log('value', value)}
              style={{display:'none'}}
          />  */}
          <div className = 'footer'>
            {
              !isUpdate?
              <button onClick = {this.createSilder} className="btn btn-primary btn-block">Créer</button>
              :
              <button onClick = {this.updateSlider} className="btn btn-primary btn-block">Modifier</button>
            }
          </div>
          </form>
        </div>
      </Rodal>
      {/* Default Light Table */}
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Active Users</h6>
            </CardHeader>
            {
              this.state.listSlider.length != 0?
              <CardBody className="p-0 pb-3">
                <table className="table mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th scope="col" className="border-0">
                       Image
                      </th>
                      <th scope="col" className="border-0">
                        Description
                      </th>
                      <th scope="col" className="border-0">
                        Is active
                      </th>
                      <th scope="col" className="border-0">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.listSlider.map((item) => {
                        return(
                          <tr>
                            <td>
                              <img src = {item.imageUrl}  className = "imageSilder" />
                            </td>
                            <td>{item.description}</td>
                            <td>
                              <Switch
                                height = {15}
                                width = {30}
                                offColor = '#ff7675'
                                checked={item.isActive}
                              />
                            </td>
                            <td>
                              <i onClick = {() => this.toggleModal(item)} className="material-icons mr-1 md-gray">create</i>
                              <i onClick = {() => this.toggleModalRemove(item)} className="material-icons mr-1 md-danger">delete</i>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </CardBody>
              :
              <p>aucune Slider pour le moment</p>
            }
          </Card>
        </Col>
      </Row>
    </Container>
    )
  }
}



export default withRouter(Tables);
