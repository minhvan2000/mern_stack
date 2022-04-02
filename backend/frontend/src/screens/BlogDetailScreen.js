import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import GoTop from '../components/GoTop/GoTop';
import { getPosts, getPostSlug } from '../redux/actions/postActions';
import { getTopics } from '../redux/actions/topicActions';
import './styles/blog.scss';

const BlogDetailScreen = (props) => {
    const dispatch = useDispatch();
    const slug = props.match.params.slug;
    const listTopic = useSelector((state) => state.topic.topics);
    const post = useSelector((state) => state.post.post);
    const listPost = useSelector((state) => state.post.posts_list);
    var listPostByTopic = [];
    if (listPost.Posts) {
        listPostByTopic = listPost.Posts.filter(
            (value) => value.topicId === post.topicId && value.status === '1'
        );
    }
    var i = 0;

    console.log(listPostByTopic.length);

    listPostByTopic.forEach((value, key) => {
        if (value._id === post._id) {
            i = key;
            console.log(key);
        }
    });

    const checkTopic = (id) => {
        var topicArr = [];
        listTopic.Topics.forEach((value) => {
            if (id.includes(value._id)) {
                topicArr.push(value.name);
            }
        });
        return topicArr[0].toString();
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
        dispatch(getPosts());
        dispatch(getTopics());
        if (slug) {
            dispatch(getPostSlug(slug));
        }
    }, [dispatch, slug]);

    return (
        <>
            <div>
                <div className="breacrumb-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="breadcrumb-text product-more">
                                    <Link to="/">
                                        <i className="fa fa-home"></i> Trang Chủ
                                    </Link>
                                    <Link to="/tin-tuc">Tin Tức</Link>
                                    <span>Bài Viết</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* !-- Breadcrumb Section End -- */}

                {post.length !== 0 ? (
                    <section className="blog-details spad">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="blog-details-inner">
                                        <div className="blog-detail-title">
                                            <h2>{post.title}</h2>
                                            <p>
                                                {checkTopic(post.topicId)}{' '}
                                                <span>
                                                    -{' '}
                                                    {post.createdAt.substring(
                                                        0,
                                                        10
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: post.summary,
                                            }}
                                        ></p>
                                        {/* <div className="blog-large-pic" >
                                        <img src={`https://shopfashi.herokuapp.com/posts/${post.image}`} alt="" />
                                    </div> */}
                                        <div
                                            className="blog-detail-desc"
                                            style={{ marginTop: '50px' }}
                                            dangerouslySetInnerHTML={{
                                                __html: post.content,
                                            }}
                                        ></div>
                                        {/* <div className="blog-quote">
                                        <p>“ Technology is nothing. What's important is that you have a faith in people, that
                                            they're basically good and smart, and if you give them tools, they'll do wonderful
                                            things with them.” <span>- Steven Jobs</span></p>
                                    </div> */}
                                        {/* <div className="blog-more">
                                        <div className="row">
                                            <div className="col-sm-4">
                                                <img src="assets/img/blog/blog-detail-1.jpg" alt="" />
                                            </div>
                                            <div className="col-sm-4">
                                                <img src="assets/img/blog/blog-detail-2.jpg" alt="" />
                                            </div>
                                            <div className="col-sm-4">
                                                <img src="assets/img/blog/blog-detail-3.jpg" alt="" />
                                            </div>
                                        </div>
                                    </div> */}

                                        <div className="tag-share">
                                            <div className="details-tag">
                                                <ul>
                                                    <li>
                                                        <i className="fa fa-tags"></i>
                                                    </li>
                                                    {listTopic.Topics.length !==
                                                    0 ? (
                                                        listTopic.Topics.filter(
                                                            (item) =>
                                                                item.slug !==
                                                                props.location.pathname.split(
                                                                    '/'
                                                                )[2]
                                                        ).map((value) => {
                                                            return (
                                                                <li
                                                                    key={
                                                                        value._id
                                                                    }
                                                                >
                                                                    {value.name}
                                                                </li>
                                                            );
                                                        })
                                                    ) : (
                                                        <li></li>
                                                    )}
                                                </ul>
                                            </div>
                                            <div className="blog-share">
                                                <span>Share:</span>
                                                <div className="social-links">
                                                    <a href=".#">
                                                        <i className="fa fa-facebook"></i>
                                                    </a>
                                                    <a href=".#">
                                                        <i className="fa fa-twitter"></i>
                                                    </a>
                                                    <a href=".#">
                                                        <i className="fa fa-google-plus"></i>
                                                    </a>
                                                    <a href=".#">
                                                        <i className="fa fa-instagram"></i>
                                                    </a>
                                                    <a href=".#">
                                                        <i className="fa fa-youtube-play"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="blog-post">
                                            <div className="row">
                                                {listPostByTopic.length !==
                                                0 ? (
                                                    i === 0 ? (
                                                        <>
                                                            <div className="col-lg-5 col-md-6"></div>
                                                            <div className="col-lg-5 offset-lg-2 col-md-6">
                                                                <Link
                                                                    to={`/tin-tuc/${
                                                                        listPostByTopic[
                                                                            i +
                                                                                1
                                                                        ].slug
                                                                    }`}
                                                                    className="next-blog"
                                                                >
                                                                    <div className="nb-pic">
                                                                        <img
                                                                            src={`https://shopfashi.herokuapp.com/posts/${
                                                                                listPostByTopic[
                                                                                    i +
                                                                                        1
                                                                                ]
                                                                                    .image
                                                                            }`}
                                                                            alt=""
                                                                        />
                                                                        <i className="ti-arrow-right"></i>
                                                                    </div>
                                                                    <div className="nb-text">
                                                                        <span>
                                                                            Tin
                                                                            Tiếp
                                                                            Theo:
                                                                        </span>
                                                                        <h5>
                                                                            {
                                                                                listPostByTopic[
                                                                                    i +
                                                                                        1
                                                                                ]
                                                                                    .title
                                                                            }
                                                                        </h5>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </>
                                                    ) : i ===
                                                      listPostByTopic.length -
                                                          1 ? (
                                                        <>
                                                            <div className="col-lg-5 col-md-6">
                                                                <Link
                                                                    to={`/tin-tuc/${
                                                                        listPostByTopic[
                                                                            i -
                                                                                1
                                                                        ].slug
                                                                    }`}
                                                                    className="prev-blog"
                                                                >
                                                                    <div className="pb-pic">
                                                                        <i className="ti-arrow-left"></i>
                                                                        <img
                                                                            src={`https://shopfashi.herokuapp.com/posts/${
                                                                                listPostByTopic[
                                                                                    i -
                                                                                        1
                                                                                ]
                                                                                    .image
                                                                            }`}
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    <div className="pb-text">
                                                                        <span>
                                                                            Tin
                                                                            Trước:
                                                                        </span>
                                                                        <h5>
                                                                            {
                                                                                listPostByTopic[
                                                                                    i -
                                                                                        1
                                                                                ]
                                                                                    .title
                                                                            }
                                                                        </h5>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="col-lg-5 offset-lg-2 col-md-6"></div>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="col-lg-5 col-md-6">
                                                                <Link
                                                                    to={`/tin-tuc/${
                                                                        listPostByTopic[
                                                                            i -
                                                                                1
                                                                        ].slug
                                                                    }`}
                                                                    className="prev-blog"
                                                                >
                                                                    <div className="pb-pic">
                                                                        <i className="ti-arrow-left"></i>
                                                                        <img
                                                                            src={`https://shopfashi.herokuapp.com/posts/${
                                                                                listPostByTopic[
                                                                                    i -
                                                                                        1
                                                                                ]
                                                                                    .image
                                                                            }`}
                                                                            alt=""
                                                                        />
                                                                    </div>
                                                                    <div className="pb-text">
                                                                        <span>
                                                                            Tin
                                                                            Trước:
                                                                        </span>
                                                                        <h5>
                                                                            {
                                                                                listPostByTopic[
                                                                                    i -
                                                                                        1
                                                                                ]
                                                                                    .title
                                                                            }
                                                                        </h5>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                            <div className="col-lg-5 offset-lg-2 col-md-6">
                                                                <Link
                                                                    to={`/tin-tuc/${
                                                                        listPostByTopic[
                                                                            i +
                                                                                1
                                                                        ].slug
                                                                    }`}
                                                                    className="next-blog"
                                                                >
                                                                    <div className="nb-pic">
                                                                        <img
                                                                            src={`https://shopfashi.herokuapp.com/posts/${
                                                                                listPostByTopic[
                                                                                    i +
                                                                                        1
                                                                                ]
                                                                                    .image
                                                                            }`}
                                                                            alt=""
                                                                        />
                                                                        <i className="ti-arrow-right"></i>
                                                                    </div>
                                                                    <div className="nb-text">
                                                                        <span>
                                                                            Tin
                                                                            Tiếp
                                                                            Theo:
                                                                        </span>
                                                                        <h5>
                                                                            {
                                                                                listPostByTopic[
                                                                                    i +
                                                                                        1
                                                                                ]
                                                                                    .title
                                                                            }
                                                                        </h5>
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        </>
                                                    )
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="posted-by">
                                            <div className="pb-pic">
                                                <img
                                                    src="assets/img/blog/post-by.png"
                                                    alt=""
                                                />
                                            </div>
                                            <div className="pb-text">
                                                <a href=".#">
                                                    <h5>Shane Lynch</h5>
                                                </a>
                                                <p>
                                                    Aliquip ex ea commodo
                                                    consequat. Duis aute irure
                                                    dolor in reprehenderit in
                                                    voluptate velit esse cillum
                                                    bore et dolore magna aliqua.
                                                    Ut enim ad minim veniam,
                                                    quis nostrud amodo
                                                </p>
                                            </div>
                                        </div>
                                        <div className="leave-comment">
                                            <h4>Leave A Comment</h4>
                                            <form
                                                action="#"
                                                className="comment-form"
                                            >
                                                <div className="row">
                                                    <div className="col-lg-6">
                                                        <input
                                                            type="text"
                                                            placeholder="Name"
                                                        />
                                                    </div>
                                                    <div className="col-lg-6">
                                                        <input
                                                            type="text"
                                                            placeholder="Email"
                                                        />
                                                    </div>
                                                    <div className="col-lg-12">
                                                        <textarea placeholder="Messages"></textarea>
                                                        <button
                                                            type="submit"
                                                            className="site-btn"
                                                        >
                                                            Send message
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="blog-details spad">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="blog-details-inner">
                                        <div className="blog-detail-title">
                                            <h2 style={{ color: 'red' }}>
                                                Post Not Found
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default BlogDetailScreen;