var H5P = H5P || {};

/**
 * Will render several columns with potentially multiple content instances in each column
 *
 * @param {Array} content
 * @param {int} contentId
 * @returns {H5P.Columns} Instance
 */
H5P.Columns = (function ($) {
        
  function C (content, contentId) {
    if (!(this instanceof H5P.Columns)) {
      return new H5P.Columns(content, contentId);
    }

    H5P.QuestionContainer.call(this, content.columns, contentId);
    
    var defaults = {
      columns: []
    };
    this.params = $.extend(true, {}, defaults, content);

    this.columns = new Array();
    this.$myDom;
    
    // Instantiate column instances
    for (var i = 0; i < this.params.columns.length; i++) {
      var columnData = this.params.columns[i].column;
      // override content parameters.
      if (this.params.override && this.params.override.overrideButtons) {
        // Extend subcontent with the overrided settings.
        $.extend(columnData.params.behaviour, {
          enableRetry: this.params.override.overrideRetry,
          enableSolutionsButton: this.params.override.overrideShowSolutionButton
        });
      }

      $.extend(columnData.params, {
        postUserStatistics: false
      });
      
      this.columns.push(H5P.newRunnable(columnData, contentId));
    }
  }
  
  C.prototype = Object.create(H5P.QuestionContainer.prototype);
  C.prototype.constructor = C;

  // Function for attaching the pages to a dom element.
  C.prototype.attach = function (target) {
    // TODO: Add code that creates the actual HTML
    if (typeof(target) === "string") {
      this.$myDom = $('#' + target);
    }
    else {
      this.$myDom = $(target);
    }
    
    this.$myDom.addClass('h5p-columns');

    // Attach columns
    for (var i = 0; i < this.columns.length; i++) {
      var column = this.columns[i];
      
      var $columnHolder = $('<div class="h5p-column"></div>')
        .css("width", this.params.columns[i].width + '%');

      column.attach($columnHolder);
      this.$myDom.append($columnHolder);
    }

    this.$.trigger('resize');
    return this;
  };

  return C;
})(H5P.jQuery);
