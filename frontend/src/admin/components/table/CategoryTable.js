import moment from 'moment';
import React, { useEffect, useState } from 'react';
import Pagination from 'react-js-pagination';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useRouteMatch } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    CATE_DELETE_RESET,
    CATE_DESTROY_RESET,
    CATE_RESTORE_RESET,
    CATE_STATUS_RESET,
} from '../../../constants/categoryConstant';
import {
    activeCategories,
    getCategories,
    getTrashCategories,
} from '../../../redux/actions/categoryActions';
import './style.scss';

const CategoryTable = (props) => {
    const list = props.list;
    const dispatch = useDispatch();
    let { url } = useRouteMatch();
    const [itemsChecked, setItemsChecked] = useState([]);
    const [activePage, setCurrentPage] = useState(1);

    const handelCate = useSelector((state) => state.category);

    const {
        error: errorHandle,
        active: activeCate,
        trash: pushCateToTrash,
        delete: deleteCate,
        restore: restoreCate,
    } = handelCate;

    const indexOfLastTodo = activePage * 5;

    const indexOfFirstTodo = indexOfLastTodo - 5;

    var currentTodos = [];
    if (list && list.length !== 0) {
        currentTodos = list.slice(indexOfFirstTodo, indexOfLastTodo);
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const checkCate = (id) => {
        var catArr = [];
        list.forEach((value) => {
            if (id.includes(value._id)) {
                catArr.push(value.name);
            }
        });
        return <p>{catArr.toString()}</p>;
    };

    const isChecked = (e, id) => {
        const checked = e.target.checked;
        if (checked) {
            setItemsChecked((oldval) => [...oldval, id]);
        } else {
            setItemsChecked(
                itemsChecked.filter((item) => {
                    return item !== id;
                })
            );
        }
    };

    useEffect(() => {
        if (errorHandle && errorHandle.length !== 0) {
            toast.error(errorHandle);
        }

        if (activeCate && activeCate === true) {
            dispatch(getCategories());
            dispatch({ type: CATE_STATUS_RESET });
        }

        if (pushCateToTrash && pushCateToTrash === true) {
            var inputs = document.querySelectorAll('#checkbox-1');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].checked = false;
            }
            setItemsChecked([]);
            dispatch(getCategories());
            dispatch({ type: CATE_DELETE_RESET });
        }

        if (deleteCate && deleteCate === true) {
            var inputsTrash = document.querySelectorAll('#checkbox-1');
            for (var j = 0; j < inputsTrash.length; j++) {
                inputsTrash[j].checked = false;
            }
            setItemsChecked([]);
            dispatch(getTrashCategories());
            dispatch({ type: CATE_DESTROY_RESET });
        }

        if (restoreCate && restoreCate === true) {
            var inputTrash = document.querySelectorAll('#checkbox-1');
            for (var k = 0; k < inputTrash.length; k++) {
                inputTrash[k].checked = false;
            }
            setItemsChecked([]);
            dispatch(getTrashCategories());
            dispatch({ type: CATE_RESTORE_RESET });
        }

        props.setDeleteItems(itemsChecked);
    }, [
        activeCate,
        deleteCate,
        dispatch,
        errorHandle,
        itemsChecked,
        props,
        pushCateToTrash,
        restoreCate,
    ]);

    return (
        <div className="tables-wrapper">
            <div className="row">
                <div className="col-lg-12">
                    <div className="card-style mb-30">
                        <div className="table-wrapper table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            <h6>#</h6>
                                        </th>
                                        <th>
                                            <h6>Tên Danh Mục</h6>
                                        </th>

                                        {url === '/admin/categories/trash' ? (
                                            <th>
                                                <h6>Thời Điểm Xóa</h6>
                                            </th>
                                        ) : (
                                            <>
                                                <th>
                                                    <h6>Danh Mục Cha</h6>
                                                </th>
                                                <th>
                                                    <h6>Phân Loại</h6>
                                                </th>
                                                <th>
                                                    <h6>Trạng Thái</h6>
                                                </th>
                                                <th>
                                                    <h6>Chức Năng</h6>
                                                </th>
                                            </>
                                        )}
                                    </tr>
                                    {/*-- end table row--*/}
                                </thead>
                                {currentTodos.length === 0 ? (
                                    <p className="text-center">
                                        Không Có Danh Mục Nào Cả
                                    </p>
                                ) : (
                                    <tbody>
                                        {currentTodos.map((value, key) => {
                                            return (
                                                <tr key={key} id={value._id}>
                                                    <td>
                                                        <div className="check-input-primary">
                                                            <input
                                                                className="form-check-input check-admin"
                                                                type="checkbox"
                                                                id="checkbox-1"
                                                                onClick={(e) =>
                                                                    isChecked(
                                                                        e,
                                                                        value._id
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="min-width">
                                                        <p>{value.name}</p>
                                                    </td>
                                                    {value.deleted === false ? (
                                                        <>
                                                            <td className="min-width">
                                                                {checkCate(
                                                                    value.parentCate
                                                                )}
                                                            </td>
                                                            <td className="min-width">
                                                                <p>
                                                                    {value.type}
                                                                </p>
                                                            </td>
                                                            <td>
                                                                <div className="action">
                                                                    {value.status ===
                                                                    '1' ? (
                                                                        <button
                                                                            className="text-success"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    activeCategories(
                                                                                        value._id
                                                                                    )
                                                                                )
                                                                            }
                                                                            title="Show"
                                                                        >
                                                                            <i className="far fa-eye"></i>
                                                                        </button>
                                                                    ) : (
                                                                        <button
                                                                            className="text-danger"
                                                                            onClick={() =>
                                                                                dispatch(
                                                                                    activeCategories(
                                                                                        value._id
                                                                                    )
                                                                                )
                                                                            }
                                                                            title="Hidden"
                                                                        >
                                                                            <i className="far fa-eye-slash"></i>
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className="action">
                                                                    <Link
                                                                        to={`${url}/${value._id}`}
                                                                        className="text-primary"
                                                                        title="Edit"
                                                                    >
                                                                        <i className="fas fa-pen-square"></i>
                                                                    </Link>
                                                                </div>
                                                            </td>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <td className="min-width">
                                                                <p>
                                                                    {moment(
                                                                        value.deletedAt
                                                                    )
                                                                        .utc()
                                                                        .format(
                                                                            'DD-MM-YYYY HH:ss'
                                                                        )}
                                                                </p>
                                                            </td>
                                                        </>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                        {/*-- end table row --*/}
                                    </tbody>
                                )}
                            </table>
                            <Pagination
                                itemClass="page-item"
                                linkClass="page-link"
                                activePage={activePage}
                                itemsCountPerPage={5}
                                totalItemsCount={list ? list.length : 0}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                            />
                            {/*-- end table --*/}
                        </div>
                    </div>
                    {/*-- end card --*/}
                </div>
                {/*-- end col --*/}
            </div>
            {/*-- end row --*/}
        </div>
    );
};

export default CategoryTable;
