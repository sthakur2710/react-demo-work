import React, { Component } from "react";
import axios from "axios";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition
} from "react-toasts";
import "react-toastify/dist/ReactToastify.css";
import { confirmAlert } from "react-confirm-alert"; // Import
import { withRouter } from "react-router-dom";

class EditQualification extends Component {
  constructor(props) {
    super(props);
    var get_id = localStorage.getItem("edit_id");
    this.state = {
      button_status: "false",
      id: get_id,
      rows: []
    };
    this.getDetails_qualification();
  }

  getDetails_qualification = () => {
    console.log("now check agan", this.state);
    axios
      .get(`http://localhost:5000/get_qualification/` + this.state.id)
      .then(res => {
        if (res.data !== "") {
          this.setState({
            rows: res.data.qualification_details
          });
        }
      });
  };

  add_qualification = () => {
    const item = {
      qualification_name: "",
      year: ""
    };
    this.setState({
      rows: [...this.state.rows, item],
      button_status: "true"
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    confirmAlert({
      title: "Confirm to update",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            let formData = new FormData(); //formdata object
            formData.append("rows", this.state);
            axios
              .put(
                `http://localhost:5000/update_qualification/` + this.state.id,
                this.state
              )
              .then(res => {
                ToastsStore.success("Qualification updated successfully");
                this.setState({
                  rows: []
                });
                this.getDetails_qualification();

                //setTimeout(this.props.history.push('/manage_users'), 8000);

                setTimeout(() => {
                  this.props.history.push("/manage_users");
                }, 4000);
              });
          }
        },
        {
          label: "No"
        }
      ]
    });
  };
  remove_qualification = () => {
    const qualify_details = [...this.state.rows];
    const new_data = qualify_details.slice(0, -1);
    this.setState({
      rows: new_data
    });
  };

  remove_qualification_specific = id => {
    const row = [...this.state.rows];

    const rows = row.filter((item, j) => j !== id);
    this.setState(
      {
        rows
      },
      () => {
        console.log("new set state update", this.state);
      }
    );
  };

  handleChange = (i, e) => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[i][name] = value;
    this.setState(
      {
        rows
      },
      () => {
        for (let i = 0; i < this.state.rows.length; i++) {
          if (
            this.state.rows[i].qualification_name === "" ||
            this.state.rows[i].year === ""
          ) {
            this.setState({
              button_status: "true"
            });
            break;
          } else if (
            this.state.rows[i].qualification_name !== "" ||
            this.state.rows[i].year !== ""
          ) {
            this.setState({
              button_status: "false"
            });
          }
        }
      }
    );
    // this.setState((prevState) => ({...prevState,rows: rows}
    //     ))
  };

  render() {
    return (
      <div className="row">
        <ToastsContainer
          store={ToastsStore}
          position={ToastsContainerPosition.TOP_RIGHT}
        />
        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{JSON.stringify(this.state)} */}
        <table className="table table-bordered table-hover">
          <thead>
            <tr>
              <th className="text-center"> #</th>
              <th className="text-center"> Qualification Name </th>
              <th className="text-center"> Year </th>
              <th className="text-center"> Remove </th>
            </tr>
          </thead>
          <tbody>
            {this.state.rows !== "" ? (
              this.state.rows.map((itme, i) => (
                <tr key={i}>
                  <td className="text-center">{i}</td>
                  <td className="text-center">
                    <input
                      type="text"
                      value={itme.qualification_name}
                      name="qualification_name"
                      onChange={e => this.handleChange(i, e)}
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="text"
                      value={itme.year}
                      name="year"
                      onChange={e => this.handleChange(i, e)}
                    />
                  </td>
                  <td className="text-center">
                    <button
                      className="btn-floating btn-large waves-effect waves-light red float-right"
                      onClick={() => this.remove_qualification_specific(i)}
                    >
                      remove
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <h3 className="App">
                Please add qualification first
                <br></br> <br></br>
              </h3>
            )}
          </tbody>
          <tfoot>
            {/* || this.state.button_status=="true" */}
            <button
              type="button"
              disabled={
                this.state.rows.length === 0 ||
                this.state.button_status === "true"
              }
              onClick={this.handleSubmit}
              className="btn-primary btn-large waves-effect waves-light red float-right"
            >
              Update
            </button>
            <button
              className="btn-floating btn-large waves-effect waves-light blue"
              onClick={this.add_qualification}
            >
              Add qualification
            </button>
            <button
              disabled={this.state.rows.length === 0}
              className="btn-floating btn-large waves-effect waves-light red float-right"
              onClick={this.remove_qualification}
            >
              Minus
            </button>
          </tfoot>
        </table>
      </div>
    );
  }
}

export default withRouter(EditQualification);
