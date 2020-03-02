import React, { Component } from "react";
import { connect } from "react-redux";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import { Link } from "react-router-dom"; 

import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Button from "react-bootstrap/Button";
import { GetDetails, deleteUser } from "../myactions/action";
import $ from "jquery";
import Modal from "react-bootstrap/Modal";

class ManageUser extends Component {
  constructor(props) {
    super(props);  

    this.state = {
      selected_user_id: 0,
      rating: "",
      description: "",
      show: false,
      search_text: "blank",
      get_user_details: [],
      currentPage: 1,
      todosPerPage: 3,
      upperPageBound: 3,
      lowerPageBound: 0,
      isPrevBtnActive: "disabled",
      isNextBtnActive: "",
      pageBound: 3
    };
  }

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

  componentDidMount() {
    this.getDetails();
  }
  componentDidUpdate() {
    $("ul li.active").removeClass("active");
    $("ul li#" + this.state.currentPage).addClass("active");
  }

  handleClick = event => {
    let listid = Number(event.target.id);
    this.setState({
      currentPage: listid
    });
    $("ul li.active").removeClass("active");
    $("ul li#" + listid).addClass("active");
    this.setPrevAndNextBtnClass(listid);
  };
  setPrevAndNextBtnClass = listid => {
    let totalPage = Math.ceil(
      this.state.get_user_details.length / this.state.todosPerPage
    );
    this.setState({ isNextBtnActive: "disabled" });
    this.setState({ isPrevBtnActive: "disabled" });
    if (totalPage === listid && totalPage > 1) {
      this.setState({ isPrevBtnActive: "" });
    } else if (listid === 1 && totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
    } else if (totalPage > 1) {
      this.setState({ isNextBtnActive: "" });
      this.setState({ isPrevBtnActive: "" });
    }
  };

  btnIncrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound + this.state.pageBound
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound + this.state.pageBound
    });
    let listid = this.state.upperPageBound + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };

  btnDecrementClick = () => {
    this.setState({
      upperPageBound: this.state.upperPageBound - this.state.pageBound
    });
    this.setState({
      lowerPageBound: this.state.lowerPageBound - this.state.pageBound
    });
    let listid = this.state.upperPageBound - this.state.pageBound;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };

  btnPrevClick = () => {
    if ((this.state.currentPage - 1) % this.state.pageBound === 0) {
      this.setState({
        upperPageBound: this.state.upperPageBound - this.state.pageBound
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound - this.state.pageBound
      });
    }
    let listid = this.state.currentPage - 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };
  btnNextClick = () => {
    if (this.state.currentPage + 1 > this.state.upperPageBound) {
      this.setState({
        upperPageBound: this.state.upperPageBound + this.state.pageBound
      });
      this.setState({
        lowerPageBound: this.state.lowerPageBound + this.state.pageBound
      });
    }
    let listid = this.state.currentPage + 1;
    this.setState({ currentPage: listid });
    this.setPrevAndNextBtnClass(listid);
  };

  get_details_user = id => {
    localStorage.setItem("edit_id", id);
  };

  
  getDetails = () => {
    axios
      .get(`/find_all/` + this.state.search_text)
      .then(res => {
        this.props.GetDetails(res.data);
        this.setState({
          get_user_details: res.data
        });
      });
  };

  handleSubmitrating = () => {
    axios
      .put(
        "/user_rating/" + this.state.selected_user_id,
        this.state
      )
      .then(res => {
        console.log("rating given successfully", res);
        ToastsStore.success("Rating sent successfully");
      });
  };
  handleChangeData = search_text => {
    this.setState(
      {
        search_text: search_text
      },
      () => {
        this.getDetails();
      }
    );
  };
  render() {
    console.log("change poss", this.state.query);
    const {
      get_user_details,
      currentPage,
      todosPerPage,
      upperPageBound,
      lowerPageBound,
      isPrevBtnActive,
      isNextBtnActive
    } = this.state;
    console.log("data now", get_user_details);

    const indexOfLastTodo = currentPage * todosPerPage;
    const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
    const currentTodos = get_user_details.slice(
      indexOfFirstTodo,
      indexOfLastTodo
    );

    const renderTodos = currentTodos.map((todo1, index) => {
      return (  
        <React.Fragment key={index}>
          <tr >
            <td>{todo1._id}</td>
            <td>
              {/* {todo1.file ? (
                {/* <img src={require(`../../src/${todo1.file}`)} /> */}
               
              <img src={todo1.file} />


            </td>
            <td>{todo1.name}</td>
            <td>{todo1.email}</td>
            <td>{todo1.MobileNo}</td>
            <td>
              <Link
                className="btn waves-effect waves-light"
                onClick={() => this.get_details_user(todo1._id)}
                to="/edit"
              >
                Edit
              </Link>
              &nbsp;
              <a
                className="btn waves-effect waves-light"
                onClick={() => this.props.deleteUser(todo1._id)}
              >
                Delete
              </a>
              <Link
                to="/view_qualification"
                className="btn-floating btn-large waves-effect waves-light red"
                onClick={() => this.get_details_user(todo1._id)}
              >
                View{" "}
              </Link>
              <Link
                className="btn-floating btn-large waves-effect waves-light red"
                to="/edit_qualification"
                onClick={() => this.get_details_user(todo1._id)}
              >
                edit qua
              </Link>
              <Link
                className="btn-floating btn-large waves-effect waves-light red"
                to="/add_qualification"
                onClick={() => this.get_details_user(todo1._id)}
              >
                <i className="material-icons">add</i>
              </Link>
              <button
                className="waves-effect waves-light btn sm"
                onClick={() => this.handleShow(todo1._id)}
              >
                User Rating
              </button>
            </td>
          </tr>
        </React.Fragment>
      );
    });
    console.log("get render todos", currentTodos);
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(get_user_details.length / todosPerPage);
      i++
    ) {
      pageNumbers.push(i);
    }

    const renderPageNumbers = pageNumbers.map(number => {
      if (number === 1 && currentPage === 1) {
        return (
          <li key={number} className="active" id={number}>
            <a href="/#" id={number} onClick={this.handleClick}>
              {number}
            </a>
          </li>
        );
      } else if (number < upperPageBound + 1 && number > lowerPageBound) {
        return (
          <li key={number} id={number}>
            <a href="/#" id={number} onClick={this.handleClick}>
              {number}
            </a>
          </li>
        );
      }
    });
    let pageIncrementBtn = null;
    if (pageNumbers.length > upperPageBound) {
      pageIncrementBtn = (
        <li className="">
          <a href="/#" onClick={this.btnIncrementClick}>
            {" "}
            &hellip;{" "}
          </a>
        </li>
      );
    }
    let pageDecrementBtn = null;
    if (lowerPageBound >= 1) {
      pageDecrementBtn = (
        <li className="">
          <a href="/#" onClick={this.btnDecrementClick}>
            {" "}
            &hellip;{" "}
          </a>
        </li>
      );
    }
    let renderPrevBtn = null;
    if (isPrevBtnActive === "disabled") {
      renderPrevBtn = (
        <li className={isPrevBtnActive}>
          <span id="btnPrev"> Prev </span>
        </li>
      );
    } else {
      renderPrevBtn = (
        <li className={isPrevBtnActive}>
          <a href="/#" id="btnPrev" onClick={this.btnPrevClick}>
            {" "}
            Prev{" "}
          </a>
        </li>
      );
    }
    let renderNextBtn = null;
    if (isNextBtnActive === "disabled") {
      renderNextBtn = (
        <li className={isNextBtnActive}>
          <span id="btnNext"> Next </span>
        </li>
      );
    } else {
      renderNextBtn = (
        <li className={isNextBtnActive}>
          <a href="/#" id="btnNext" onClick={this.btnNextClick}>
            {" "}
            Next{" "}
          </a>
        </li>
      );
    }
    //console.log('image', this.props.Allusers)
    return (
      <div>
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />

        <input
          placeholder="Search for..."
          name="search_text"
          onChange={e => this.handleChangeData(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {renderTodos}
            {/* 
         {
           this.props.Allusers.length > 0 
            ? 
            
            this.props.Allusers.map((item,j)=> (
              
              <tr key={item._id}>
                <td>{item._id}</td>
                <td>
                  
                  {item.file ? 

                  <img src={require(`../../src/${item.file}`)}/>

                  :
"no image "
                  }
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.MobileNo}</td>
                <td>
                  <a onClick={()=>this.get_details_user(item._id)} href="/edit">Edit</a>&nbsp;
                  <a onClick={()=>this.props.deleteUser(item._id)}>Delete</a>
                </td>
              </tr>
            ))
                        :
            'No data found'
         } */}
          </tbody>
        </table>
        <Modal show={this.state.show} onHide={() => this.handleClose()}>
          <Modal.Header closeButton>
            <Modal.Title>User Rating</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form
              className="col s12"
              onSubmit={e => this.handleSubmitrating(e)}
            >
              <div className="row">
                <div className="input-field col s12">
                  <input
                    placeholder="Placeholder"
                    id="rating"
                    name="rating"
                    onChange={e => this.setState({ rating: e.target.value })}
                    value={this.state.rating}
                    type="text"
                    className="validate"
                  />
                  <label for="first_name">Name</label>
                </div>
              </div>
              <div className="row">
                <div className="input-field col s12">
                  <input
                    placeholder="Placeholder"
                    id="description"
                    name="description"
                    onChange={e =>
                      this.setState({ description: e.target.value })
                    }
                    value={this.state.description}
                    type="text"
                    className="validate"
                  />
                  <label for="first_name">Description</label>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => this.handleClose()}>
              Close
            </Button>
            <Button
              variant="primary"
              type="button"
              onClick={this.handleSubmitrating}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
        <br></br>
        <ul className="pagination">
          {renderPrevBtn}
          {pageDecrementBtn}
          {renderPageNumbers}
          {pageIncrementBtn}
          {renderNextBtn}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    Allusers: state.Allusers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    GetDetails: data => {
      dispatch(GetDetails(data));
    },
    deleteUser: id => {
      dispatch(deleteUser(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageUser);
