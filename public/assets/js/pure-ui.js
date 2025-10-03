/* Minimal UI script to replace Bootstrap interactions: dropdown, modal, tabs, collapse */
(function(){
  function on(el, ev, cb){ el && el.addEventListener(ev, cb, false); }
  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  // Dropdown
  qsa('[data-bs-toggle="dropdown"], .dropdown-toggle').forEach(function(toggle){
    on(toggle, 'click', function(e){
      e.preventDefault();
      var parent = toggle.closest('.dropdown');
      if(!parent) return;
      var opened = parent.classList.contains('open');
      qsa('.dropdown.open').forEach(function(d){ d.classList.remove('open'); });
      if(!opened) parent.classList.add('open');
    });
  });
  on(document, 'click', function(e){
    if(!e.target.closest('.dropdown')) qsa('.dropdown.open').forEach(function(d){ d.classList.remove('open'); });
  });

  // Tabs (pills)
  qsa('[data-bs-toggle="pill"], [data-bs-toggle="tab"]').forEach(function(link){
    on(link, 'click', function(e){
      e.preventDefault();
      var targetSel = link.getAttribute('href');
      if(!targetSel || targetSel === '#') return;
      var tab = qs(targetSel);
      if(!tab) return;
      // deactivate current
      var container = tab.parentElement;
      qsa('.tab-pane', container).forEach(function(p){ p.classList.remove('show','active'); });
      qsa('[data-bs-toggle="pill"], [data-bs-toggle="tab"]').forEach(function(a){ a.classList.remove('active'); });
      // activate
      link.classList.add('active');
      tab.classList.add('show','active');
    });
  });

  // Collapse
  qsa('[data-bs-toggle="collapse"]').forEach(function(trigger){
    var targetSel = trigger.getAttribute('data-bs-target');
    var target = targetSel ? qs(targetSel) : null;
    on(trigger, 'click', function(){
      if(!target) return;
      var isShown = target.classList.contains('show');
      if(isShown) target.classList.remove('show'); else target.classList.add('show');
    });
  });

  // Modal (data-bs-toggle="modal" data-bs-target="#id")
  qsa('[data-bs-toggle="modal"]').forEach(function(btn){
    var targetSel = btn.getAttribute('data-bs-target');
    var modal = targetSel ? qs(targetSel) : null;
    on(btn, 'click', function(e){
      if(!modal) return; e.preventDefault();
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  // Close modal buttons
  qsa('[data-bs-dismiss="modal"], .btn-close').forEach(function(btn){
    on(btn, 'click', function(){
      var modal = btn.closest('.modal');
      if(modal){ modal.classList.remove('open'); document.body.style.overflow = ''; }
    });
  });
  // Backdrop/static close behavior
  qsa('.modal').forEach(function(modal){
    on(modal, 'click', function(e){ if(e.target === modal) modal.classList.remove('open'); });
  });
})();


