from django.urls import path,include
from .views import Candidate, MunicipalityList,DistrictList,ProvinceList, DistrictsByProvince, MunicipalitiesByDistrict

urlpatterns = [
    path('auth/',include('login.urls')),
    path('candidate/',Candidate.as_view()),
    path('candidate/<int:pk>/', Candidate.as_view()),
    path('municipalities/', MunicipalityList.as_view()),
    path('districts/', DistrictList.as_view()),
    path('provinces/', ProvinceList.as_view()),
    path('districts/by-province/<int:province_id>/', DistrictsByProvince.as_view()),
    path('municipalities/by-district/<int:district_id>/', MunicipalitiesByDistrict.as_view()),
]
