import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, Modal, StyleSheet, Button } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, author, rating, comment) => dispatch(postComment(dishId, author, rating, comment))
});

function RenderDish(props) {
    const dish = props.dish;

    if (dish != null) {
        return (
          <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
            <Card
                featuredTitle={dish.name}
                image={{ uri: baseUrl + dish.image }}>
                <Text style={{ margin: 10 }}>
                    {dish.description}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Icon
                        raised
                        reverse
                        name={props.favorite ? 'heart' : 'heart-o'}
                        type='font-awesome'
                        color='#f50'
                        onPress={() => props.favorite ? console.log("Already Favorite!") : props.onPress()}
                    />
                    <Icon
                        raised
                        reverse
                        name={'pencil'}
                        type='font-awesome'
                        color='#522da7'
                        onPress={() => { props.toggleModal() }}
                    />
                </View>
                
            </Card>
            </Animatable.View>
        );
    }

    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentsItem = ({ item, index }) => {
        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    readonly
                    startingValue={item.rating}
                    imageSize={12}
                    style={styles.rating}
                />
                <Text style={{ fontSize: 12 }}>{'--' + item.author + ', ' + item.date}</Text>
            </View>
        );
    }

    return (
      <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>    
        <Card title="Comments">
            <FlatList
                data={comments}
                renderItem={renderCommentsItem}
                keyExtractor={item => item.id.toString()}
            />
        </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            userRating: 1,
            author: '',
            comment: '',
            showModal: false
        }
    }

    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }
    handleComment(dishId) {
        const author = this.state.author;
        const comment = this.state.comment;
        const rating = this.state.userRating;
        this.props.postComment(dishId, author, rating, comment);
        this.resetForm();
    }
    resetForm() {
        this.setState({
            userRating: 0,
            author: '',
            comment: ''
        })
    }



    markFavorite(dishId) {
        this.props.postFavorite(dishId)
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    toggleModal={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            ratingCount={5}
                            size={20}
                            showRating
                            startingValue={5}
                            onFinishRating={(rating) => { this.setState({ userRating: rating }) }}
                            style={{ paddingVertical: 10 }}
                        />
                    </View>
                    <View style={{ marginBottom: 40 }}>
                        <Input
                            placeholder='Author'
                            value={this.state.author}
                            onChangeText={(value) => { this.setState({ author: value }) }}
                            leftIcon={
                                <Icon
                                    name='user'
                                    type='font-awesome'
                                    size={24}
                                />
                            }
                        />
                        <Input
                            placeholder='Comment'
                            value={this.state.comment}
                            onChangeText={(value) => { this.setState({ comment: value }) }}
                            leftIcon={
                                <Icon
                                    name='comment'
                                    type='font-awesome'
                                    size={20}
                                />
                            }
                        />
                        <View style={{ marginBottom: 20 }}>
                            <Button
                                onPress={() => { this.toggleModal(); this.handleComment(dishId) }}
                                color="#512da7"
                                title="Submit"
                            />
                        </View>
                        <View>
                            <Button
                                onPress={() => { this.toggleModal(); this.resetForm(); }}
                                color="#808080"
                                title="Cancel"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    rating: {
        alignSelf: 'flex-start',
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);