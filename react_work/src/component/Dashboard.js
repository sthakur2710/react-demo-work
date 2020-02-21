import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import { Link, withRouter } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Footer from "../component/Footer";
import ReactGooglePlacesSuggest from "react-google-places-suggest"

const MY_API_KEY = "AIzaSyDwsdjfskhdbfjsdjbfksiTgnoriOAoUOgsUqOs10J0" // fake


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false
    };
  }

  handleInputChange = e => {
    this.setState({search: e.target.value, value: e.target.value})
}

  logout = () => {
    localStorage.removeItem("token");
    this.props.history.push("/");
  };
  handleClose = () => {
    this.setState({
      show: false
    });
  };

  handleShow = id => {
    this.setState({
      show: true,
      selected_user_id: id
    });
  };
  render() {
    return (
      <>
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
        <Footer />
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>Hotel Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
                <Form.Label>Hotel Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" />
                <Form.Text className="text-muted">
                We'll never share your email with anyone else.
                </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Mobile No</Form.Label>
                <Form.Control type="text" placeholder="Mobile No" />
            </Form.Group>
            <Form.Group controlId="formBasicCheckbox">
                <Form.Check type="checkbox" label="Check me out" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
            </Form>

          </Modal.Body>
          <Modal.Footer></Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default withRouter(Dashboard);
