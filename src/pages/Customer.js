import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import NotFound from "../components/NotFound";
import { baseUrl } from "../shared";
import { LoginContext } from "../App";

export default function Customer() {
  const [loggedIn, setLoggedIn] = useContext(LoginContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState();
  const [tempCustomer, setTempCustomer] = useState();
  const [notFound, setNotFound] = useState();
  const [changed, setChanged] = useState(false);
  const [error, setError] = useState();

  const location = useLocation();

  useEffect(() => {
    if (!customer) return;
    if (!customer) return;

    let equal = true;
    if (customer.name !== tempCustomer.name) equal = false;
    if (customer.industry !== tempCustomer.industry) equal = false;

    if (equal) setChanged(false);
  });

  useEffect(() => {
    const url = baseUrl + "api/customers/" + id;
    fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
    })
      .then((response) => {
        if (response.status === 404) {
          //render a 404 component in this page
          setNotFound(true);
        } else if (response.status === 401) {
          setLoggedIn(false);
          navigate("/login", {
            state: {
              previousUrl: location.pathname,
              currentUrl: location.pathname,
            },
          });
        }

        if (!response.ok) {
          throw new Error("Something went wrong, try again later");
        }

        return response.json();
      })
      .then((data) => {
        setCustomer(data.customer);
        setTempCustomer(data.customer);
        setError(undefined);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  function updateCustomer(e) {
    e.preventDefault();
    const url = baseUrl + "api/customers/" + id;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("access"),
      },
      body: JSON.stringify(tempCustomer),
    })
      .then((response) => {
        if (response.status === 401) {
          setLoggedIn(false);
          navigate("/login", {
            state: {
              previousUrl: location.pathname,
            },
          });
        }
        if (!response.ok) throw new Error("something went wrong");
        return response.json();
      })
      .then((data) => {
        let equal = true;
        if (customer.name !== tempCustomer.name) equal = false;
        if (customer.industry !== tempCustomer.industry) equal = false;
        
        setCustomer(data.customer);
        setChanged(false);
        setError(undefined);
      })
      .catch((e) => {
        setError(e.message);
      });
  }

  return (
    <div class="p-3">
      {notFound ? <p>The customer with id {id} was not found</p> : null}

      {customer ? (
        <div>
          <form
            className="w-full max-w-sm"
            id="customer"
            onSubmit={updateCustomer}
          >
            <div className="md:flex md:items-center mb-6">
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form
                        onSubmit={(e) => {
                            handleClose();
                            e.preventDefault();
                            props.updateEmployee(props.id, name, role);
                        }}
                        id="editmodal"
                        className="w-full max-w-sm"
                    >
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label
                                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="name"
                                >
                                    Full Name
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="md:flex md:items-center mb-6">
                            <div className="md:w-1/3">
                                <label
                                    className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                    for="role"
                                >
                                    Role
                                </label>
                            </div>
                            <div className="md:w-2/3">
                                <input
                                    className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                    id="role"
                                    type="text"
                                    value={role}
                                    onChange={(e) => {
                                        setRole(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        form="editmodal"
                    >
                        Update
                    </button>
                </Modal.Footer>
            </Modal>

              <div className="md:w-3/4">
                <input
                  className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                  id="name"
                  type="text"
                  value={tempCustomer.name}
                  onChange={(e) => {
                    setChanged(true);
                    setTempCustomer({
                      ...tempCustomer,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="md:flex md:items-center mb-6">
              <div className="md:w-1/4">
                <label for="industry">Industry</label>
              </div>
            </div>
          </form>
          {changed ? (
            <div className="mb-2">
              <button
                className="bg-slate-400 hover:bg-slate-500 text-white font-bold py-2 px-4 mr-2 rounded"
                onClick={(e) => {
                  setTempCustomer({ ...customer });
                  setChanged(false);
                }}
              >
                Cancel
              </button>
              <button
                form="customer"
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
              >
                Save
              </button>
            </div>
          ) : null}

          <div>
            <button
              className="bg-slate-800 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded"
              onClick={(e) => {
                const url = baseUrl + "api/customers/" + id;
                fetch(url, {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("access"),
                  },
                })
                  .then((response) => {
                    if (response.status === 401) {
                      setLoggedIn(false);
                      navigate("/login", {
                        state: {
                          previousUrl: location.pathname,
                        },
                      });
                    }
                    if (!response.ok) {
                      throw new Error("Something went wrong");
                    }
                    navigate("/customers");
                  })
                  .catch((e) => {
                    setError(e.message);
                  });
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}

      {error ? <p>{error}</p> : null}
      <br />
      <Link to="/customers">
        <button className="no-underline bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          ← Go back
        </button>
      </Link>
    </div>
  );
}
