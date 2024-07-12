import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'

export default function CampSection() {

  return (
    <>
    
<section role="dialog" aria-modal="true" aria-labelledby="welcome-mat-100-label" className="slds-modal slds-fade-in-open slds-modal_small">
<div className="slds-modal__container">
<button className="slds-button slds-button_icon slds-modal__close slds-button_icon-inverse">
<svg className="slds-button__icon slds-button__icon_large" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#close"></use>
</svg>
<span className="slds-assistive-text">Cancel and close</span>
</button>
<div className="slds-modal__header slds-modal__header_empty"></div>
<div className="slds-modal__content" id="welcome-mat-100-content">
<div className="slds-welcome-mat">
<div className="slds-welcome-mat__content slds-grid">
<div className="slds-welcome-mat__info slds-size_1-of-2" role="region">
<div className="slds-welcome-mat__info-content">
<h2 id="welcome-mat-100-label" className="slds-welcome-mat__info-title">The Lightning Experience is here!</h2>
<p className="slds-welcome-mat__info-description slds-text-longform">Welcome to Lightning Experience, the modern, beautiful user experience from Salesforce. With a sales-and service-centric mindset, we focused on reinventing the desktop environment to better support your business processes.</p>
<div className="slds-welcome-mat__info-progress slds-welcome-mat__info-progress_complete">
<div className="slds-welcome-mat__info-badge-container">
<img className="slds-welcome-mat__info-badge" src="/assets/images/welcome-mat/trailhead_badge@2x.png" width="50" height="50" alt="" />
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check slds-icon_xx-small" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
<p>
<strong>Lightning Explorer</strong>
</p>
<p>Cha-ching! You earned the badge.</p>
</div>
<button className="slds-button slds-button_brand">View on your Trailblazer Profile</button>
</div>
</div>
<ul className="slds-welcome-mat__tiles slds-size_1-of-2">
<li className="slds-welcome-mat__tile slds-welcome-mat__tile_complete">
<a href="#" className="slds-box slds-box_link slds-media">
<div className="slds-media__figure slds-media__figure_fixed-width slds-align_absolute-center">
<div className="slds-welcome-mat__tile-figure">
<div className="slds-welcome-mat__tile-icon-container">
<span className="slds-icon_container slds-icon-utility-animal_and_nature">
<svg className="slds-icon slds-icon-text-default" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#animal_and_nature"></use>
</svg>
</span>
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
</div>
</div>
<div className="slds-media__body">
<div className="slds-welcome-mat__tile-body">
<h3 className="slds-welcome-mat__tile-title">Welcome to Salesforce!</h3>
<p className="slds-welcome-mat__tile-description">Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.</p>
</div>
</div>
</a>
</li>
<li className="slds-welcome-mat__tile slds-welcome-mat__tile_complete">
<a href="#" className="slds-box slds-box_link slds-media">
<div className="slds-media__figure slds-media__figure_fixed-width slds-align_absolute-center">
<div className="slds-welcome-mat__tile-figure">
<div className="slds-welcome-mat__tile-icon-container">
<span className="slds-icon_container slds-icon-utility-call">
<svg className="slds-icon slds-icon-text-default" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#call"></use>
</svg>
</span>
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
</div>
</div>
<div className="slds-media__body">
<div className="slds-welcome-mat__tile-body">
<h3 className="slds-welcome-mat__tile-title">Learn About OpenCTI</h3>
<p className="slds-welcome-mat__tile-description">Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.</p>
</div>
</div>
</a>
</li>
<li className="slds-welcome-mat__tile slds-welcome-mat__tile_complete">
<a href="#" className="slds-box slds-box_link slds-media">
<div className="slds-media__figure slds-media__figure_fixed-width slds-align_absolute-center">
<div className="slds-welcome-mat__tile-figure">
<div className="slds-welcome-mat__tile-icon-container">
<span className="slds-icon_container slds-icon-utility-upload">
<svg className="slds-icon slds-icon-text-default" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#upload"></use>
</svg>
</span>
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
</div>
</div>
<div className="slds-media__body">
<div className="slds-welcome-mat__tile-body">
<h3 className="slds-welcome-mat__tile-title">Power Up the Utility Bar</h3>
<p className="slds-welcome-mat__tile-description">Tap into case history or share notes with fellow agents—it all happens on the utility bar.</p>
</div>
</div>
</a>
</li>
<li className="slds-welcome-mat__tile slds-welcome-mat__tile_complete">
<a href="#" className="slds-box slds-box_link slds-media">
<div className="slds-media__figure slds-media__figure_fixed-width slds-align_absolute-center">
<div className="slds-welcome-mat__tile-figure">
<div className="slds-welcome-mat__tile-icon-container">
<span className="slds-icon_container slds-icon-utility-magicwand">
<svg className="slds-icon slds-icon-text-default" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#magicwand"></use>
</svg>
</span>
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
</div>
</div>
<div className="slds-media__body">
<div className="slds-welcome-mat__tile-body">
<h3 className="slds-welcome-mat__tile-title">Customize your view</h3>
<p className="slds-welcome-mat__tile-description">Tailor your cases to your team&#x27;s workflow with custom list views.</p>
</div>
</div>
</a>
</li>
<li className="slds-welcome-mat__tile slds-welcome-mat__tile_complete">
<a href="#" className="slds-box slds-box_link slds-media">
<div className="slds-media__figure slds-media__figure_fixed-width slds-align_absolute-center">
<div className="slds-welcome-mat__tile-figure">
<div className="slds-welcome-mat__tile-icon-container">
<span className="slds-icon_container slds-icon-utility-knowledge_base">
<svg className="slds-icon slds-icon-text-default" aria-hidden="true">
<use xlinkHref="/assets/icons/utility-sprite/svg/symbols.svg#knowledge_base"></use>
</svg>
</span>
<span className="slds-icon_container slds-icon_container_circle slds-icon-action-check" title="Completed">
<svg className="slds-icon slds-welcome-mat__icon-check" aria-hidden="true">
<use xlinkHref="/assets/icons/action-sprite/svg/symbols.svg#check"></use>
</svg>
<span className="slds-assistive-text">Completed</span>
</span>
</div>
</div>
</div>
<div className="slds-media__body">
<div className="slds-welcome-mat__tile-body">
<h3 className="slds-welcome-mat__tile-title">Share the Knowledge</h3>
<p className="slds-welcome-mat__tile-description">Harness your team&#x27;s collective know-how with our powerful knowledge base.</p>
</div>
</div>
</a>
</li>
</ul>
</div>
</div>
</div>
</div>
</section>
<div className="slds-backdrop slds-backdrop_open" role="presentation"></div>
    </>
  )
}
