define(['ojs/ojcore'], function (oj) {
    var MovieFactory = {
        resourceUrl: 'js/resources/data.json',
        // Create a single movie instance:
        createMovieModel: function () {
            var Movie = oj.Model.extend({
                urlRoot: this.resourceUrl,
                idAttribute: "DepartmentId"
            });
            return new Movie();
        },
        // Create a movie collection:
        createMovieCollection: function () {
            var Movies = oj.Collection.extend({
                url: this.resourceUrl,
                model: this.createMovieModel()
            });
            return new Movies();
        }
    };
    return MovieFactory;
});