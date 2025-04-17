﻿using Cozy_Cuisine.Data.IRepositories;
using Cozy_Cuisine.Data.Repositories;
using Cozy_Cuisine.Models;
using Cozy_Cuisine.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;

namespace Cozy_Cuisine.Controllers
{
    public class PatchController : Controller
    {
        private readonly IPatchRepository _patchRepository;

        public PatchController(IPatchRepository patchRepository)
        {
            _patchRepository = patchRepository;
        }

        [HttpGet]
        public async Task<IActionResult> PatchManagement()
        {
            var PMVM = new PatchManagementVM
            {
                Patches = await _patchRepository.GetAllPatchesAsync(),
                NewPatch = null
            };
           return View(PMVM);
        }


        [HttpPost]      
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> CreatePatch(PatchManagementVM model)
        {
            if (model.NewPatch != null)
            {
                await _patchRepository.AddPatchAsync(model.NewPatch);
                TempData["Success"] = "Data was submitted successfully.";
                return RedirectToAction("PatchManagement");
            };

            TempData["Error"] = "Something has gone wrong and data was not added.";
            return RedirectToAction("PatchManagement");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> EditPatch(Patches model)
        {
            var patch = await _patchRepository.GetPatchByIdAsync(model.PatchId);
            if (patch != null)
            {
                patch.Version = model.Version;
                patch.PatchNotes = model.PatchNotes;
                patch.PatchName = model.PatchName;
                patch.URLImageList = model.URLImageList;
                patch.URLGif = model.URLGif;
                patch.GameURL = model.GameURL;

                await _patchRepository.UpdatePatchAsync(patch);
                TempData["Success"] = "Patch updated successfully.";
                return RedirectToAction("PatchManagement");
            }

            TempData["Error"] = "Patch not found.";
            return RedirectToAction("PatchManagement");
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeletePatch(int id)
        {
            var isDeleted = await _patchRepository.DeletePatchAsync(id);

            if (!isDeleted)
            {
                TempData["Error"] = "Record does not exist.";
            }
            else
            {
                TempData["Success"] = "Record deleted successfully.";
            }

            return RedirectToAction("PatchManagement");
        }

        [HttpGet]
        public async Task<IActionResult> BugReportManagement()
        {
            var bugReport = await _patchRepository.GetAllBugReports();
                             
            var BRMVM = new BugReportManagementVM
            {
                BugReports = bugReport,
                NewComments = null
            };
            return View(BRMVM);
        }

        [HttpGet]
        public async Task<IActionResult> ReportBug(int patchId)
        {
            var patch = await _patchRepository.GetPatchByIdAsync(patchId);
            if (patch == null) return NotFound();

            var model = new PatchBaseVM
            {
                Patches = patch
            };
            
            return View(model);
        }
        
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ReportBug(int patchId, BugReport bugReport)
        {
            if (ModelState.IsValid)
            {
                bugReport.PatchId = patchId;
                await _patchRepository.AddBugReportAsync(bugReport);
                TempData["Success"] = "Bug Reported Successfully!";
                return RedirectToAction(nameof(ReportBug), new { patchId });
            }
            TempData["Error"] = "Invalid, Something went wrong.";
            return View(bugReport);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateBugStatus(int bugId, string status)
        {
            var bugReport = await _patchRepository.GetBugReportByIdAsync(bugId);
            if (bugReport == null) 
            { 
                return NotFound(); 
            }; 

            bugReport.Status = status;
            await _patchRepository.UpdateBugReportAsync(bugReport);

            // Return the updated partial view (just this dropdown gets re-rendered)
            return PartialView("_BugStatusDropdown", bugReport);
        }

    }
}
