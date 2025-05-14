from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .serializers import candidateSerializer, MunicipalitySerializer,DistrictSerializer,ProvinceSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsAdminOrReadOnly
from .models import Candidates,Ward,Province,Municipality,District
from rest_framework import status
# Create your views here.

class Candidate(APIView):
    permission_classes=[IsAdminOrReadOnly]
    def post(self,request):
        candidate=request.data
        serializer=candidateSerializer(data=candidate)
        if serializer.is_valid(raise_exception=True):
            serializer.save() 
            return Response({
                "message":"Candidate Added sucessfully"
            },status=status.HTTP_201_CREATED)
        else :
            return Response(data=serializer.errors,status=401)  
    
    def delete(self,request,pk):
        try:
            candidate = Candidates.objects.get(pk=pk)
        except Candidates.DoesNotExist:
            return Response({'error': 'Candidate not found'}, status=status.HTTP_404_NOT_FOUND)
        candidate.delete()
        return Response({'message': 'Candidate deleted'}, status=status.HTTP_204_NO_CONTENT)
       
    def get(self,request):
        province=request.query_params.get('province')
        district=request.query_params.get('district')
        municipality=request.query_params.get('municipality')
        ward_no=request.query_params.get('ward_no')
        
        filters = {}
        if province:
            filters['ward__municipality__district__province__name'] = province
        if district:
            filters['ward__municipality__district__name'] = district
        if municipality:
            filters['ward__municipality__name'] = municipality
        if ward_no:
            filters['ward__ward_no'] = ward_no
        print(filters)
        query_sets=Candidates.objects.filter(**filters
            ).select_related('ward__municipality__district__province')
        
        # print(query_sets.query)
        # for candidate in query_sets:
        #     print(candidate.__all__)
        serializer=candidateSerializer(query_sets,many=True)
       
        return Response(serializer.data,status=status.HTTP_200_OK)
      
            
class MunicipalityList(APIView):
    def get(self, request):
        municipalities = Municipality.objects.all().order_by('name')
        serializer = MunicipalitySerializer(municipalities, many=True)
        return Response(serializer.data)
            
            
class DistrictList(APIView):
    def get(self, request):
        districts = District.objects.all().order_by('name')
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)
            
class ProvinceList(APIView):
    def get(self, request):
        provinces = Province.objects.all().order_by('name')
        serializer = ProvinceSerializer(provinces, many=True)
        return Response(serializer.data)

class DistrictsByProvince(APIView):
    def get(self, request, province_id):
        districts = District.objects.filter(province_id=province_id).order_by('name')
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)

class MunicipalitiesByDistrict(APIView):
    def get(self, request, district_id):
        municipalities = Municipality.objects.filter(district_id=district_id).order_by('name')
        serializer = MunicipalitySerializer(municipalities, many=True)
        return Response(serializer.data)

