import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import { withRouter } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Footer from "../component/Footer";
import { Typeahead } from "react-bootstrap-typeahead";
import options from "../component/data";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Geocode from "react-geocode";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";
// import { debuggerStatement } from "@babel/types";

Geocode.setApiKey("AIzaSyBPAu5c1AoGURvC4gY6QTzHx_iV9tIqXRg");
Geocode.enableDebug();
Geocode.setLanguage("en");

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      editshow: false,
      selected: "",
      name: "",
      phone: "",
      file: [],
      hotel_details: [],
      current_hotel_details: [],
      location_obj: [],
      errors: {
        name: "",
        selected: "",
        phone: "",
        file: ""
      }
    };
  }

  componentDidMount() {
    this.getHotelDetails();
    // this.get_lat_long('indore')
  }

  //--------------get lat long function---------------
  // get_lat_long= async (user_location)=>
  //  {
  //   let details_data = {};
  //   let loc_data = await Geocode.fromAddress(user_location);
  //   console.log('loc data now',loc_data.results[0].geometry.location.lat)
  //   details_data['lat']=loc_data.results[0].geometry.location.lat
  //   details_data['lng']=loc_data.results[0].geometry.location.lng
  //   return details_data
  // }

  get_lat_long(user_location) {
    Geocode.fromAddress(user_location)
      .then(response => {
        const { lat, lng } = response.results[0].geometry.location;
        console.log("location call hui", lat, lng);
        return { lat, lng };
      })
      .catch(error => {
        console.log("error", error);
      });
  }

  getHotelDetails = async () => {
    const promise_arr = [];
    const res = await axios.get(`/get_hostel_details`);
    if (res.status === 200) {
      this.setState({ hotel_details: res.data.hotel_details });
      if (res.data.hotel_details.length > 0) {
        let promise = new Promise(function(resolve, reject) {
          let arr = [];
          res.data.hotel_details.map(data => {
            Geocode.fromAddress(data.location)
              .then(response => {
                const { lat, lng } = response.results[0].geometry.location;
                arr.push({ lat, lng });
              })
              .catch(error => {
                console.log("error", error);
              });
          });

          resolve(arr);
        });

        promise_arr.push(promise);

        // promise.then(
        //   data => {
        //     console.log(
        //       "Got data! Promise fulfilled.",
        //       data,
        //       typeof data,
        //       Object.keys(data).length
        //     );
        //   },
        //   error => {
        //     console.log("Promise rejected.");
        //     console.log(error.message);
        //   }
        // );
      }

      Promise.all(promise_arr)
        .then(data => {
          console.log("First handler", data[0]);
          data[0].map((item)=>{
            console.log('each val', item)
          })

        })
        .then(data => {
          console.log("Second handler", data);
        });
    }
  };

  EditHandleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "Name can not be empty";
    } else {
      errors["name"] = "";
    }
    if (!this.state.phone) {
      formIsValid = false;
      errors["phone"] = "Mobile No. can not be empty";
    } else {
      errors["phone"] = "";
    }

    this.setState({ errors: errors });
    return formIsValid;
  }

  handleValidation() {
    let errors = {};
    let formIsValid = true;

    if (!this.state.name) {
      formIsValid = false;
      errors["name"] = "Name can not be empty";
    } else {
      errors["name"] = "";
    }
    if (!this.state.phone) {
      formIsValid = false;
      errors["phone"] = "Mobile No. can not be empty";
    } else {
      errors["phone"] = "";
    }
    if (this.state.selected.length === 0) {
      formIsValid = false;
      errors["selected"] = "Location can not be empty";
    }
    if (this.state.file.length === 0) {
      formIsValid = false;
      errors["file"] = "Please select file";
    } else {
      errors["file"] = "";
    }
    this.setState({ errors: errors });
    return formIsValid;
  }

  logout = () => {
    localStorage.removeItem("token");
    this.props.history.push("/");
  };
  handleClose = () => {
    this.setState({
      show: false,
      editshow: false
    });
  };

  SubmitHotelDetails = e => {
    e.preventDefault();
    if (this.handleValidation()) {
      let formData = new FormData(); //formdata object
      formData.append("name", this.state.name); //append the values with key, value pair
      formData.append("phone", this.state.phone); //append the values with key, value pair
      formData.append("location", this.state.selected[0].label); //append the values with key, value pair
      formData.append("file", this.state.file); //append the values with key, value pair

      axios
        .post(`/create_hotel_details`, formData)
        .then(res => {
          if (res.status === 200) {
            this.setState({
              selected: [],
              name: "",
              phone: "",
              show: false,
              file: [],
              errors: {
                name: "",
                selected: "",
                phone: "",
                file: ""
              }
            });
            toast.success(res.data.msg);
            this.getHotelDetails();
            this.handleClose();
          }
        })
        .catch(error => {
          if (error.response.status === 400) {
            toast.error(error.response.data.msg);
          }
        });
    }
  };

  UpdateHotelDetails = e => {
    e.preventDefault();
    if (this.EditHandleValidation()) {
      var current_user_id = this.state.current_hotel_details._id;
      var curent_user_data = this.state.current_hotel_details;
      curent_user_data.name = this.state.name;
      curent_user_data.phone = this.state.phone;

      axios
        .put(`/update_hotel_details/` + current_user_id, curent_user_data)
        .then(res => {
          this.setState({
            name: res.data.name,
            phone: res.data.phone,
            errors: {
              name: "",
              selected: "",
              phone: "",
              file: ""
            }
          });
          toast.success(res.data.msg);
          this.getHotelDetails();
          this.handleClose();
        });
    }
  };

  handleShow = () => {
    this.setState({
      show: true,
      selected: [],
      name: "",
      phone: "",
      file: [],
      current_hotel_details: [],
      errors: {
        name: "",
        selected: "",
        phone: "",
        file: ""
      }
    });
  };

  EditHotelDetails = id => {
    axios.get(`/get_hotel_details_record/` + id).then(res => {
      this.setState({
        current_hotel_details: res.data.data,
        name: res.data.data["name"],
        phone: res.data.data["phone"]
      });
    });
    this.setState({
      editshow: true
    });
  };
  removeHotelDetails = id => {
    axios.get(`/delete_hotel_details/` + id).then(res => {
      if (res.status === 200) {
        this.getHotelDetails();
        toast.success(res.data.msg);
      }
    });
  };
  render() {
    var points = [
      { lat: 42.02, lng: -77.01 },
      { lat: 42.03, lng: -77.02 },
      { lat: 41.03, lng: -77.04 },
      { lat: 42.05, lng: -77.02 }
    ];

    var bounds = new this.props.google.maps.LatLngBounds();
    for (var i = 0; i < points.length; i++) {
      bounds.extend(points[i]);
    }
    return (
      <>
        {JSON.stringify(this.state)}
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand href="#home">Demo Project</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link>
              <button className="mr-auto" onClick={() => this.handleShow()}>
                Get Hostel Details
              </button>
            </Nav.Link>
          </Nav>
          <Button onClick={this.logout}>Logout</Button>
        </Navbar>
        <Map
          google={this.props.google}
          zoom={5}
          initialCenter={{
            lat: 22.7196,
            lng: 75.8577
          }}
        >
          {/* {
            this.state.hotel_details.length > 0
            ?
             this.state.hotel_details.map((res, i) => (
                <Marker
                  title={"The marker`s title will appear as a tooltip."}
                  name={"SOMA"}
                  position={this.get_lat_long(res.location)}
                />
              ))
            : "no calling"
            } */}

          {/* {this.state.hotel_details.forEach((res, i) => (
            <Marker
              title={"The marker`s title will appear as a tooltip."}
              name={"SOMA"}
              position={this.get_lat_long(res.location)}
            />
          ))} */}

          <Marker
            title={"lets work appear as a tooltip."}
            name={"Your position"}
            position={{ lat: 23.2599, lng: 77.4126 }}
          />
          <Marker
            title={"lets work appear as a tooltip."}
            name={"Your position"}
            position={{ lat: 23.5236, lng: 77.814 }}
          />
        </Map>
        {this.state.hotel_details.length > 0 ? (
          this.state.hotel_details.map((item, i) => (
            <Card style={{ width: "40rem" }} key={i}>
              <Container>
                <Row>
                  <Col md="6">
                    <Card.Img variant="top" src={require(`../${item.file}`)} />
                  </Col>
                  <Col md="6">
                    <table>
                      <tr>
                        <th>Name:</th>
                        <td>{item.name}</td>
                      </tr>
                      <tr>
                        <th>Phone:</th>
                        <td>{item.phone}</td>
                      </tr>
                      <tr>
                        <th>Location:</th>
                        <td>{item.location}</td>
                      </tr>
                      <tr>
                        <th>
                          <button
                            onClick={() => this.EditHotelDetails(item._id)}
                          >
                            <i className="fa fa-edit"></i>
                          </button>
                        </th>
                        <th>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete the item?")) {
                                this.removeHotelDetails(item._id);
                              }
                            }}
                          >
                            <i className="fa fa-trash"></i>
                          </button>
                        </th>
                      </tr>
                    </table>
                  </Col>
                </Row>
              </Container>
            </Card>
          ))
        ) : (
          <h1 style={{ textAlign: "center" }}>No data found of hotel </h1>
        )}

        <Footer />
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Hotel Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.SubmitHotelDetails}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Hotel Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["name"]}
                </span>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No"
                  name="phone"
                  onChange={e => this.setState({ phone: e.target.value })}
                  value={this.state.phone}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["phone"]}
                </span>
              </Form.Group>
              <Form.Group controlId="formBasicLocation">
                <Form.Label>Location</Form.Label>
                <Typeahead
                  {...this.state}
                  id="basic-example"
                  onChange={selected => this.setState({ selected: selected })}
                  options={options}
                  placeholder="Choose a state..."
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["selected"]}
                </span>
              </Form.Group>
              <Form.Group controlId="phone" bsSize="large">
                <Form.Label>Select Image</Form.Label>
                <FormControl
                  onChange={e => this.setState({ file: e.target.files[0] })}
                  type="file"
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["file"]}
                </span>
              </Form.Group>

              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        <Modal show={this.state.editshow} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Hotel Edit Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.UpdateHotelDetails}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Hotel Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  name="name"
                  value={this.state.name}
                  onChange={e => this.setState({ name: e.target.value })}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["name"]}
                </span>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Mobile No"
                  name="phone"
                  onChange={e => this.setState({ phone: e.target.value })}
                  value={this.state.phone}
                />
                <span style={{ color: "red" }}>
                  {this.state.errors["phone"]}
                </span>
              </Form.Group>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
        <ToastContainer />
      </>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyBPAu5c1AoGURvC4gY6QTzHx_iV9tIqXRg"
})(withRouter(Dashboard));

// export default withRouter(Dashboard);
