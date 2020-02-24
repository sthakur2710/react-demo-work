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
class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      editshow:false,
      selected: "",
      name: "",
      phone: "",
      file: [],
      hotel_details: [],
      current_hotel_details:[],
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
  }

  getHotelDetails = () => {
    axios.get(`/get_hostel_details`).then(res => {
      this.setState({
        hotel_details: res.data
      });
    });
  };

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
      editshow:false,
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

      axios.post(`/create_hotel_details`, formData).then(res => {
        this.setState({
          selected: [],
          name: "",
          phone: "",
          file: [],
          errors: {
            name: "",
            selected: "",
            phone: "",
            file: ""
          }
        });
        toast.success("Hotel details added successfully");
      });
    }
  };

  UpdateHotelDetails = (e)=> {
    e.preventDefault();
    var current_user_id=this.state.current_hotel_details._id;
    var curent_user_data=this.state.current_hotel_details;
    curent_user_data.name=this.state.name;
    curent_user_data.phone=this.state.phone;

    axios.put(`/update_hotel_details/` + current_user_id, curent_user_data).then(res => {
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
      this.handleClose()
    });
  }

  handleShow = () => {
    this.setState({
      show: true,
      selected: [],
      name: "",
      phone: "",
      file: [],
      current_hotel_details:[],
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
        name:res.data.data['name'],
        phone:res.data.data['phone']
      });
    });
    this.setState({
      editshow:true,
    })
  }
  removeHotelDetails = id => {
    axios.get(`/delete_hotel_details/` + id).then(res => {
      console.log("res get", res);
      this.getHotelDetails();
      toast.success(res.data.msg);
    });
  };
  render() {
    return (
      <>
      {/* {JSON.stringify(this.state)} */}
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

        {this.state.hotel_details.length > 0
          ? this.state.hotel_details.map((item, i) => (
              <Card style={{ width: "40rem" }} key={i}>
                <Container>
                  <Row>
                    <Col md="6">
                      <Card.Img
                        variant="top"
                        src={require(`../${item.file}`)}
                      />
                    </Col>
                    <Col md="6">
                      <Card.Body>
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
                                onClick={()=>this.EditHotelDetails(item._id)}
                              >
                              <i class="fa fa-edit"></i>
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
                                <i class="fa fa-trash"></i>
                              </button>
                            </th>
                          </tr>
                        </table>
                      </Card.Body>
                    </Col>
                  </Row>
                </Container>
              </Card>
            ))
          : "NO data found"}

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

export default withRouter(Dashboard);
