function InfoBox(a) {
	a = a || {};
	google.maps.OverlayView.apply(this, arguments);
	this.content_ = a.content || "";
	this.disableAutoPan_ = a.disableAutoPan || false;
	this.maxWidth_ = a.maxWidth || 0;
	this.pixelOffset_ = a.pixelOffset || new google.maps.Size(0, 0);
	this.position_ = a.position || new google.maps.LatLng(0, 0);
	this.zIndex_ = a.zIndex || null;
	this.boxClass_ = a.boxClass || "infoBox";
	this.boxStyle_ = a.boxStyle || {};
	this.closeBoxMargin_ = a.closeBoxMargin || "2px";
	this.closeBoxURL_ = a.closeBoxURL || "http://www.google.com/intl/en_us/mapfiles/close.gif";
	if (a.closeBoxURL === "") {
		this.closeBoxURL_ = ""
	}
	this.infoBoxClearance_ = a.infoBoxClearance || new google.maps.Size(1, 1);
	if (typeof a.visible === "undefined") {
		if (typeof a.isHidden === "undefined") {
			a.visible = true
		} else {
			a.visible = !a.isHidden
		}
	}
	this.isHidden_ = !a.visible;
	this.alignBottom_ = a.alignBottom || false;
	this.pane_ = a.pane || "floatPane";
	this.enableEventPropagation_ = a.enableEventPropagation || false;
	this.div_ = null;
	this.closeListener_ = null;
	this.moveListener_ = null;
	this.contextListener_ = null;
	this.eventListeners_ = null;
	this.fixedWidthSet_ = null
}
InfoBox.prototype = new google.maps.OverlayView();
InfoBox.prototype.createInfoBoxDiv_ = function () {
	var i;
	var f;
	var a;
	var d = this;
	var c = function (e) {
		e.cancelBubble = true;
		if (e.stopPropagation) {
			e.stopPropagation()
		}
	};
	var b = function (e) {
		e.returnValue = false;
		if (e.preventDefault) {
			e.preventDefault()
		}
		if (!d.enableEventPropagation_) {
			c(e)
		}
	};
	if (!this.div_) {
		this.div_ = document.createElement("div");
		this.setBoxStyle_();
		if (typeof this.content_.nodeType === "undefined") {
			this.div_.innerHTML = this.getCloseBoxImg_() + this.content_
		} else {
			this.div_.innerHTML = this.getCloseBoxImg_();
			this.div_.appendChild(this.content_)
		}
		this.getPanes()[this.pane_].appendChild(this.div_);
		this.addClickHandler_();
		if (this.div_.style.width) {
			this.fixedWidthSet_ = true
		} else {
			if (this.maxWidth_ !== 0 && this.div_.offsetWidth > this.maxWidth_) {
				this.div_.style.width = this.maxWidth_;
				this.div_.style.overflow = "auto";
				this.fixedWidthSet_ = true
			} else {
				a = this.getBoxWidths_();
				this.div_.style.width = (this.div_.offsetWidth - a.left - a.right) + "px";
				this.fixedWidthSet_ = false
			}
		}
		this.panBox_(this.disableAutoPan_);
		if (!this.enableEventPropagation_) {
			this.eventListeners_ = [];
			f = ["mousedown", "mouseover", "mouseout", "mouseup", "click", "dblclick", "touchstart", "touchend", "touchmove"];
			for (i = 0; i < f.length; i++) {
				this.eventListeners_.push(google.maps.event.addDomListener(this.div_, f[i], c))
			}
			this.eventListeners_.push(google.maps.event.addDomListener(this.div_, "mouseover", function (e) {
				this.style.cursor = "default"
			}))
		}
		this.contextListener_ = google.maps.event.addDomListener(this.div_, "contextmenu", b);
		google.maps.event.trigger(this, "domready")

		console.log($('.ellipsis'));
		$('.ellipsis').ellipsis();
	}
};
InfoBox.prototype.getCloseBoxImg_ = function () {
	var a = "";
	if (this.closeBoxURL_ !== "") {
		a = "<img";
		a += " src=\'" + this.closeBoxURL_ + "\'";
		a += " align=right";
		a += " style=\'";
		a += " position: relative;";
		a += " cursor: pointer;";
		a += " margin: " + this.closeBoxMargin_ + ";";
		a += "\'>"
	}
	return a
};
InfoBox.prototype.addClickHandler_ = function () {
	var a;
	if (this.closeBoxURL_ !== "") {
		a = this.div_.firstChild;
		this.closeListener_ = google.maps.event.addDomListener(a, "click", this.getCloseClickHandler_())
	} else {
		this.closeListener_ = null
	}
};
InfoBox.prototype.getCloseClickHandler_ = function () {
	var a = this;
	return function (e) {
		e.cancelBubble = true;
		if (e.stopPropagation) {
			e.stopPropagation()
		}
		google.maps.event.trigger(a, "closeclick");
		a.close()
	}
};
InfoBox.prototype.panBox_ = function (d) {
	var m;
	var n;
	var e = 0,
		yOffset = 0;
	if (!d) {
		m = this.getMap();
		if (m instanceof google.maps.Map) {
			if (!m.getBounds().contains(this.position_)) {
				m.setCenter(this.position_)
			}
			n = m.getBounds();
			var a = m.getDiv();
			var h = a.offsetWidth;
			var f = a.offsetHeight;
			var k = this.pixelOffset_.width;
			var l = this.pixelOffset_.height;
			var g = this.div_.offsetWidth;
			var b = this.div_.offsetHeight;
			var i = this.infoBoxClearance_.width;
			var j = this.infoBoxClearance_.height;
			var o = this.getProjection().fromLatLngToContainerPixel(this.position_);
			if (o.x < (-k + i)) {
				e = o.x + k - i
			} else if ((o.x + g + k + i) > h) {
				e = o.x + g + k + i - h
			}
			if (this.alignBottom_) {
				if (o.y < (-l + j + b)) {
					yOffset = o.y + l - j - b
				} else if ((o.y + l + j) > f) {
					yOffset = o.y + l + j - f
				}
			} else {
				if (o.y < (-l + j)) {
					yOffset = o.y + l - j
				} else if ((o.y + b + l + j) > f) {
					yOffset = o.y + b + l + j - f
				}
			} if (!(e === 0 && yOffset === 0)) {
				var c = m.getCenter();
				m.panBy(e, yOffset)
			}
		}
	}
};
InfoBox.prototype.setBoxStyle_ = function () {
	var i, boxStyle;
	if (this.div_) {
		this.div_.className = this.boxClass_;
		this.div_.style.cssText = "";
		boxStyle = this.boxStyle_;
		for (i in boxStyle) {
			if (boxStyle.hasOwnProperty(i)) {
				this.div_.style[i] = boxStyle[i]
			}
		}
		if (typeof this.div_.style.opacity !== "undefined" && this.div_.style.opacity !== "") {
			this.div_.style.filter = "alpha(opacity=" + (this.div_.style.opacity * 100) + ")"
		}
		this.div_.style.position = "absolute";
		this.div_.style.visibility = 'hidden';
		if (this.zIndex_ !== null) {
			this.div_.style.zIndex = this.zIndex_
		}
	}
};
InfoBox.prototype.getBoxWidths_ = function () {
	var c;
	var a = {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0
	};
	var b = this.div_;
	if (document.defaultView && document.defaultView.getComputedStyle) {
		c = b.ownerDocument.defaultView.getComputedStyle(b, "");
		if (c) {
			a.top = parseInt(c.borderTopWidth, 10) || 0;
			a.bottom = parseInt(c.borderBottomWidth, 10) || 0;
			a.left = parseInt(c.borderLeftWidth, 10) || 0;
			a.right = parseInt(c.borderRightWidth, 10) || 0
		}
	} else if (document.documentElement.currentStyle) {
		if (b.currentStyle) {
			a.top = parseInt(b.currentStyle.borderTopWidth, 10) || 0;
			a.bottom = parseInt(b.currentStyle.borderBottomWidth, 10) || 0;
			a.left = parseInt(b.currentStyle.borderLeftWidth, 10) || 0;
			a.right = parseInt(b.currentStyle.borderRightWidth, 10) || 0
		}
	}
	return a
};
InfoBox.prototype.onRemove = function () {
	if (this.div_) {
		this.div_.parentNode.removeChild(this.div_);
		this.div_ = null
	}
};
InfoBox.prototype.draw = function () {
	this.createInfoBoxDiv_();
	var a = this.getProjection().fromLatLngToDivPixel(this.position_);
	this.div_.style.left = (a.x + this.pixelOffset_.width) + "px";
	if (this.alignBottom_) {
		this.div_.style.bottom = -(a.y + this.pixelOffset_.height) + "px"
	} else {
		this.div_.style.top = (a.y + this.pixelOffset_.height) + "px"
	} if (this.isHidden_) {
		this.div_.style.visibility = 'hidden'
	} else {
		this.div_.style.visibility = "visible"
	}
};
InfoBox.prototype.setOptions = function (a) {
	if (typeof a.boxClass !== "undefined") {
		this.boxClass_ = a.boxClass;
		this.setBoxStyle_()
	}
	if (typeof a.boxStyle !== "undefined") {
		this.boxStyle_ = a.boxStyle;
		this.setBoxStyle_()
	}
	if (typeof a.content !== "undefined") {
		this.setContent(a.content)
	}
	if (typeof a.disableAutoPan !== "undefined") {
		this.disableAutoPan_ = a.disableAutoPan
	}
	if (typeof a.maxWidth !== "undefined") {
		this.maxWidth_ = a.maxWidth
	}
	if (typeof a.pixelOffset !== "undefined") {
		this.pixelOffset_ = a.pixelOffset
	}
	if (typeof a.alignBottom !== "undefined") {
		this.alignBottom_ = a.alignBottom
	}
	if (typeof a.position !== "undefined") {
		this.setPosition(a.position)
	}
	if (typeof a.zIndex !== "undefined") {
		this.setZIndex(a.zIndex)
	}
	if (typeof a.closeBoxMargin !== "undefined") {
		this.closeBoxMargin_ = a.closeBoxMargin
	}
	if (typeof a.closeBoxURL !== "undefined") {
		this.closeBoxURL_ = a.closeBoxURL
	}
	if (typeof a.infoBoxClearance !== "undefined") {
		this.infoBoxClearance_ = a.infoBoxClearance
	}
	if (typeof a.isHidden !== "undefined") {
		this.isHidden_ = a.isHidden
	}
	if (typeof a.visible !== "undefined") {
		this.isHidden_ = !a.visible
	}
	if (typeof a.enableEventPropagation !== "undefined") {
		this.enableEventPropagation_ = a.enableEventPropagation
	}
	if (this.div_) {
		this.draw()
	}
};
InfoBox.prototype.setContent = function (a) {
	this.content_ = a;
	if (this.div_) {
		if (this.closeListener_) {
			google.maps.event.removeListener(this.closeListener_);
			this.closeListener_ = null
		}
		if (!this.fixedWidthSet_) {
			this.div_.style.width = ""
		}
		if (typeof a.nodeType === "undefined") {
			this.div_.innerHTML = this.getCloseBoxImg_() + a
		} else {
			this.div_.innerHTML = this.getCloseBoxImg_();
			this.div_.appendChild(a)
		} if (!this.fixedWidthSet_) {
			this.div_.style.width = this.div_.offsetWidth + "px";
			if (typeof a.nodeType === "undefined") {
				this.div_.innerHTML = this.getCloseBoxImg_() + a
			} else {
				this.div_.innerHTML = this.getCloseBoxImg_();
				this.div_.appendChild(a)
			}
		}
		this.addClickHandler_()
	}
	google.maps.event.trigger(this, "content_changed")
};
InfoBox.prototype.setPosition = function (a) {
	this.position_ = a;
	if (this.div_) {
		this.draw()
	}
	google.maps.event.trigger(this, "position_changed")
};
InfoBox.prototype.setZIndex = function (a) {
	this.zIndex_ = a;
	if (this.div_) {
		this.div_.style.zIndex = a
	}
	google.maps.event.trigger(this, "zindex_changed")
};
InfoBox.prototype.setVisible = function (a) {
	this.isHidden_ = !a;
	if (this.div_) {
		this.div_.style.visibility = (this.isHidden_ ? "hidden" : "visible")
	}
};
InfoBox.prototype.getContent = function () {
	return this.content_
};
InfoBox.prototype.getPosition = function () {
	return this.position_
};
InfoBox.prototype.getZIndex = function () {
	return this.zIndex_
};
InfoBox.prototype.getVisible = function () {
	var a;
	if ((typeof this.getMap() === "undefined") || (this.getMap() === null)) {
		a = false
	} else {
		a = !this.isHidden_
	}
	return a
};
InfoBox.prototype.show = function () {
	this.isHidden_ = false;
	if (this.div_) {
		this.div_.style.visibility = "visible"
	}
};
InfoBox.prototype.hide = function () {
	this.isHidden_ = true;
	if (this.div_) {
		this.div_.style.visibility = "hidden"
	}
};
InfoBox.prototype.open = function (c, b) {
	var a = this;
	if (b) {
		this.position_ = b.getPosition();
		this.moveListener_ = google.maps.event.addListener(b, "position_changed", function () {
			a.setPosition(this.getPosition())
		})
	}

	this.setMap(c);
	if (this.div_) {
		this.panBox_()
	}
};
InfoBox.prototype.close = function () {
	var i;
	if (this.closeListener_) {
		google.maps.event.removeListener(this.closeListener_);
		this.closeListener_ = null
	}
	if (this.eventListeners_) {
		for (i = 0; i < this.eventListeners_.length; i++) {
			google.maps.event.removeListener(this.eventListeners_[i])
		}
		this.eventListeners_ = null
	}
	if (this.moveListener_) {
		google.maps.event.removeListener(this.moveListener_);
		this.moveListener_ = null
	}
	if (this.contextListener_) {
		google.maps.event.removeListener(this.contextListener_);
		this.contextListener_ = null
	}
	this.setMap(null)
};